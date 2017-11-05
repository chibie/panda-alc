import express from 'express';
import studentAPI from './student';
import uploadsRouter from './upload';

const router = express.Router();

export default (app) => {
  router.use('/students', studentAPI.install(router));
  router.use('/uploads', uploadsRouter(app));

  app.use('/', router);
};
