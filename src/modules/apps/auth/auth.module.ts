import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/core/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from 'src/modules/apps/auth/strategy/refreshToken.strategy';
import { JwtAccessStrategy } from 'src/modules/apps/auth/strategy/accessToken.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtAccessSecret'),
          signOptions: {
            expiresIn: configService.get<string>('jwtAccessExpiresTime'),
          },
          global: true,
        };
      },

      inject: [ConfigService],
    }),
  ],
  providers: [JwtAccessStrategy, RefreshTokenStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
