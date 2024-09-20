import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { RefreshTokenGuard } from 'src/auth/gaurds/refreshToken.gaurd';
import { Validate2FADto } from 'src/auth/dto/validate2fa.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    const userId = req.user.userId;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('verify-2fa')
  async verify2FA(@Body() body: Validate2FADto) {
    const { token, access_token } = body;
    const result = await this.authService.validate2FA(access_token, token);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('disable-2fa')
  disable2fa(@Request() req) {
    return this.authService.disable2FA(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  enable2fa(@Request() req) {
    return this.authService.enable2FA(req.user.userId);
  }
}

// @Post('reset-password')
// resetPassword() {
//   return this.authService.resetPassword();
// }

// @Post('change-password')
// changePassword() {
//   return this.authService.changePassword();
// }

// @Post('verify-email')
// verifyEmail() {
//   return this.authService.verifyEmail();
// }

// @Post('send-verification-email')
// sendVerificationEmail() {
//   return this.authService.sendVerificationEmail();
// }

// @Post('send-reset-password-email')
// sendResetPasswordEmail() {
//   return this.authService.sendResetPasswordEmail();
// }

// @Post('send-change-password-email')
// sendChangePasswordEmail() {
//   return this.authService.sendChangePasswordEmail();
// }

// @Post('login-with-2fa')
// loginWith2fa() {
//   return this.authService.loginWith2fa();
// }
