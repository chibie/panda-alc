export default {
  name: 'Panda',
  env: process.env.NODE_ENV || 'development',
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  base_url: process.env.BASE_URL || 'http://localhost:3000',
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/alc',
  },
};

