export default () => ({
  appPort: parseInt(process.env.APPLICATION_PORT),
  jwtSecret: process.env.APP_JWT_SECRET,
  dbURL: process.env.DATABASE_URL,
});
