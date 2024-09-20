export default () => ({
  appPort: parseInt(process.env.APPLICATION_PORT),
  jwtAccessSecret: process.env.APP_JWT_ACCESS_SECRET,
  jwtAccessExpiresTime: process.env.APP_JWT_ACCESS_EXPIRE_TIME,
  jwtRefreshSecret: process.env.APP_JWT_REFRESH_SECRET,
  jwtRefreshExpiresTime: process.env.APP_JWT_REFRESH_EXPIRE_TIME,
  twoFATokenExpiresTime: process.env.APP_2FA_Token_EXPIRE_TIME,
  dbURL: process.env.DATABASE_URL,
});
