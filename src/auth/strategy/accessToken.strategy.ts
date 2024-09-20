import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtAccessSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.is2faToken || payload.sub === undefined) {
      throw new ForbiddenException('token is invalid');
    }
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
