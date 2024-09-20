import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { RefreshTokenGuard } from 'src/auth/gaurds/refreshToken.gaurd';
import { Validate2FADto } from 'src/auth/dto/validate2fa.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { ChangePasswordDto } from 'src/auth/dto/changePassword.dto';
import { ResetPasswordDto } from 'src/auth/dto/resetPassoword.dto';
import { VerifyEmailDto } from 'src/auth/dto/verifyEmail.dto';
import { SendEmailDto } from 'src/auth/dto/sendEmail.dto';

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
  logout(@GetUser() user: ReqUser) {
    return this.authService.logout(user.userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@GetUser() user: ReqUser & { refreshToken: string }) {
    const userId = user.userId;
    const refreshToken = user.refreshToken;
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
  disable2fa(@GetUser() user: ReqUser) {
    return this.authService.disable2FA(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  enable2fa(@GetUser() user: ReqUser) {
    return this.authService.enable2FA(user.userId);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(
      body.email,
      body.newPassword,
      body.token,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@GetUser() user: ReqUser, @Body() body: ChangePasswordDto) {
    console.log(body);

    return this.authService.changePassword(
      user.userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Post('verify-email')
  verifyEmail(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verification-email')
  sendVerificationEmail(@GetUser() user: ReqUser) {
    return this.authService.sendVerificationEmail(user.email);
  }

  @Post('send-reset-password-email')
  sendResetPasswordEmail(@Body() body: SendEmailDto) {
    return this.authService.sendResetPasswordEmail(body.email);
  }

  @Post('send-change-password-email')
  sendChangePasswordEmail(@Body() body: SendEmailDto) {
    return this.authService.sendChangePasswordEmail(body.email);
  }
}
