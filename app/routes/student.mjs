/* eslint-disable */

import API from 'mongoose-restify';
import models from '../models';

class StudentAPI extends API {

  onError(req, res, err) {
    console.error(err.name + ': ' + err.message);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        code: 'BadRequest',
        message: err.message,
        status: 400,
      });
    }

    if (err.name === "HttpError") {
      return res.status(404).json({
        code: 'NotFound',
        message: 'Resource not found.',
        status: 404,
      });
    }

    return res.status(500).json({
      code: 'InternalServerError',
      message: err.message,
      status: 500,
    });
  }
};

/* eslint-enable */

const studentAPI = new StudentAPI({
  path: '/students',
  model: models.Student,
});

export default studentAPI;
