import express from 'express';
import studentAPI from './student';

const router = express.Router();

export default (app) => {
  router.use('/students', studentAPI.install(router));

  app.use('/', router);
};
