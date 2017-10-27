import API from 'mongoose-restify';
import models from '../models';

const studentAPI = new API({
  path: '/students',
  model: models.Student,
});

export default studentAPI;
