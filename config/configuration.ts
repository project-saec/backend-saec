export default () => ({
  appName: 'saec project',
  appPort: parseInt(Bun.env.APPLICATION_PORT),
  jwtAccessSecret: Bun.env.APP_JWT_ACCESS_SECRET,
  jwtAccessExpiresTime: Bun.env.APP_JWT_ACCESS_EXPIRE_TIME,
  jwtRefreshSecret: Bun.env.APP_JWT_REFRESH_SECRET,
  jwtRefreshExpiresTime: Bun.env.APP_JWT_REFRESH_EXPIRE_TIME,
  jwt2FASecret: Bun.env.APP_JWT_2FA_SECRET,
  twoFATokenExpiresTime: Bun.env.APP_2FA_Token_EXPIRE_TIME,
  jwtEmailVerifySecret: Bun.env.APP_JWT_EMAIL_VERIFY_SECRET,
  jwtEmailVerifyExpiresTime: Bun.env.APP_JWT_EMAIL_VERIFY_EXPIRE_TIME,
  jwtResetSecret: Bun.env.APP_JWT_RESET_SECRET,
  jwtResetExpiresTime: Bun.env.APP_JWT_RESET_EXPIRE_TIME,
  dbURL: Bun.env.DATABASE_URL,
  mailHost: Bun.env.MAIL_HOST,
  mailPort: Bun.env.MAIL_PORT,
  mailPassword: Bun.env.MAIL_PASSWORD,
  mailUser: Bun.env.MAIL_USER,
  defaultMailFrom: 'saec@test.com',
  frontUrl: Bun.env.FRONT_URL,
});
