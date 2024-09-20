import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from 'src/auth/strategy/accessToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from 'src/auth/strategy/refreshToken.strategy';

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
