import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/core/user/user.service';
import * as speakeasy from 'speakeasy';
import { comparePassword, hashPassword } from 'src/utils/hashing';
import * as argon2 from 'argon2';
import { Address } from 'nodemailer/lib/mailer';
import { EmailService } from 'src/modules/share/email/email.service';
import { LoginDto } from 'src/modules/apps/auth/dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

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
    try {
      const decoded = this.jwtService.verify(access_token, {
        secret: this.configService.get<string>('jwt2FASecret'),
      });

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

      const tokens = await this.getTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
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
      };

      return {
        message: '2FA required',
        access_token: this.jwtService.sign(twoFaPayload, {
          secret: this.configService.get<string>('jwt2FASecret'),
          expiresIn: this.configService.get<string>('twoFATokenExpiresTime'),
        }),
      };
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
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
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async resetPassword(email: string, newPassword: string, token: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    try {
      const validToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtResetSecret'),
      });

      if (!validToken || validToken.email !== email) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.userService.updatePassword(user.id, hashedPassword);
      return { message: 'Password has been reset successfully' };
    } catch (err) {
      console.log(err);

      throw new BadRequestException('invalid token');
    }
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const passwordValid = await comparePassword(user.password, oldPassword);
    if (!passwordValid)
      throw new BadRequestException('Old password is incorrect');

    const hashedNewPassword = await hashPassword(newPassword);
    await this.userService.updatePassword(userId, hashedNewPassword);
    return { message: 'Password changed successfully' };
  }

  async verifyEmail(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtEmailVerifySecret'),
      });

      const user = await this.userService.findById(decodedToken.sub);
      if (!user) throw new NotFoundException('User not found');

      await this.userService.verifyEmail(user.id);
      return { message: 'Email verified successfully' };
    } catch (err) {
      throw new BadRequestException('invalid token');
    }
  }
  async sendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = this.jwtService.sign(
      { sub: user.id, email },
      {
        secret: this.configService.get<string>('jwtEmailVerifySecret'),
        expiresIn: this.configService.get<string>('jwtEmailVerifyExpiresTime'),
      },
    );
    const emailAddressObject: Address = {
      name: user.first_name + ' ' + user.last_name,
      address: email,
    };
    return this.mailService.sendVerificationEmail(emailAddressObject, token);
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get<string>('jwtResetSecret'),
        expiresIn: this.configService.get<string>('jwtResetExpiresTime'),
      },
    );
    const emailAddressObject: Address = {
      name: user.first_name + ' ' + user.last_name,
      address: email,
    };
    return this.mailService.sendResetPasswordEmail(emailAddressObject, token);
  }

  async sendChangePasswordEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const emailAddressObject: Address = {
      name: user.first_name + ' ' + user.last_name,
      address: email,
    };
    return this.mailService.sendChangePasswordEmail(emailAddressObject);
  }

  private async getTokens(userId: number, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
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
  private hashData(data: string) {
    return argon2.hash(data);
  }
}
