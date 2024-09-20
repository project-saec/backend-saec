import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as speakeasy from 'speakeasy';
import { comparePassword, hashPassword } from 'src/utils/hashing';
import { LoginDto } from 'src/auth/dto/login.dto';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private hashData(data: string) {
    return argon2.hash(data);
  }
  async register(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
    });
    if (user) {
      return 'user created successfully' + user.id;
    }
  }

  async enable2FA(userId: number) {
    const secret = speakeasy.generateSecret({ length: 20 });

    const user = await this.userService.enable2FA(userId, secret.base32);
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number) {
    await this.userService.disable2FA(userId);
    return '2FA disabled successfully';
  }
  async validate2FA(access_token: string, token: string) {
    const decoded = this.jwtService.verify(access_token);

    if (decoded.is2faToken !== true) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userService.findById(decoded.sub);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const secret = user.twoFASecret;
    if (!secret) {
      throw new BadRequestException('2FA not enabled');
    }
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA token');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(body: LoginDto) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isPasswordValid = await comparePassword(user.password, body.password);
    if (!isPasswordValid) {
      throw new BadRequestException('password is wrong');
    }
    if (user.enable2FA) {
      const twoFaPayload = {
        email: user.email,
        sub: user.id,
        is2faToken: true,
      };
      return {
        message: '2FA required',
        access_token: this.jwtService.sign(twoFaPayload, {
          expiresIn: this.configService.get<string>('twoFATokenExpiresTime'),
        }),
      };
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  private async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwtAccessSecret'),
          expiresIn: this.configService.get<string>('jwtAccessExpiresTime'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwtRefreshSecret'),
          expiresIn: this.configService.get<string>('jwtRefreshExpiresTime'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    await this.userService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
