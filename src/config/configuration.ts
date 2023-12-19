export default () => ({
  port: parseInt(process.env.PORT, 10) || 7000,
  jwtSecret: process.env.JWT_SECRET,
});
