export default () => ({
  appPort: parseInt(process.env.APPLICATION_PORT),
  jwtSecret: process.env.APP_JWT_SECRET,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_DATABASE,
  dbSync: process.env.DB_SYNC,
});
