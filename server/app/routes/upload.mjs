import express from 'express';
import fse from 'fs-extra';
import path from 'path';
import binary from '../middlewares/binary';
import config from '../../config';

const routes = (app, db) => {
  const router = express.Router();
  const uploadInfo = {uploadDirectory: config.uploadDirectory};

  /**
   * @api {get} /uploads/:id Get a file.
   * @apiName GetFile
   * @apiGroup Upload
   * @apiVersion 1.0.0
   * 
   * @apiDescription Write as response the bytes of the specified file.
   * 
   * @apiParam {String} id ID of the file to write to response.
   */
  router.use('/', express.static(uploadInfo.uploadDirectory));

  /**
   * @api {post} /uploads Upload a file.
   * @apiName PostFile
   * @apiGroup Upload
   * @apiVersion 1.0.0
   * 
   * @apiDescription Persist a file on disk; and return stats about the 
   *  file. The file is sent as binary in the request body. Max upload limit is
   *  10MB.
   * 
   * @apiSuccess {String} [ext] File extension, if present.
   * @apiSuccess {String} id Unique file identifier.
   * @apiSuccess {String} [mime] Mime-Type of the file, if present.
   * @apiSuccess {Number} size The filesize in bytes.
   * 
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 Created
   *  {
   *      "size": 9800721,
   *      "mime": "image/jpeg",
   *      "ext": "jpeg",
   *      "name": "ddfj4989sfj43oijs30sdljg"
   *  }
   * 
   */
  router.post('/',
    binary(uploadInfo),
    async (req, res) => {
      return res.status(201).json(req.fileMeta);
    });

  /**
   * @api {delete} /uploads/:id Delete a previously uploaded file.
   * @apiName DeleteFile
   * @apiGroup Upload
   * @apiVersion 1.0.0
   * 
   * @apiDescription Delete a recently uploaded temporary file.
   * 
   * @apiParam {String} id Unique ID of file to delete.
   */
  router.delete('/:id', (req, res) => {
    const filepath = path.join(uploadInfo.uploadDirectory, req.params.id);

    fse.unlink(filepath, (err) => {
      if (err) {
        return res.status(500).json({
          code: 'InternalServerError',
          message: err.message,
          status: 500,
        });
      }

      res.status(204).send();
    });
  });

  return router;
};

export default routes;
