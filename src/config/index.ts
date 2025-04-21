export default () => ({
  environment: process.env.NODE_ENV || `development`,
  redis: {
    host: process.env.REDIS_HOST
  },
  // ...
});
