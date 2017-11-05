import fse from 'fs-extra';
import path from 'path';
import fileType from 'file-type';

// Maximum size of uploadeable file.
const maxUploadFileSize = 0x989680; // 10MB

/**
 * Generate random string suitable for being used as a unique uploaded filename.
 * @return {String} The generated filename
 */
const generateFilename = () => {
  // See here: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  return Math.random().toString(36).substring(2, 15) +
             Math.random().toString(36).substring(2, 15);
};

/**
 * Upload binary data to a directory on disk.
 * 
 * @param {Object} uploadInfo - Information on how to process the binary data.
 * @param {String} uploadInfo.uploadDirectory - Directory to save binary data.
 * 
 * @return {Function} - Function that actually does the saving.
 */
const binary = ({uploadDirectory}) => {
  return (req, res, next) => {
    let buf = new Buffer('');

    req.on('data', (chunk) => {
      // Reject files greater than the upload limit
      if (buf.byteLength + chunk.byteLength > maxUploadFileSize) {
        // This is a hack to end the request prematurely. We remove all 
        // listeners that could allow the request to continue, and then we
        // write a response.
        // TODO: write a better logic to end the request.
        req.removeAllListeners('data');
        req.removeAllListeners('end');

        // If we got here, it means that the file was too large, and we have 
        // to leave early.
        return res.status(400).json({
          code: 'BadRequest',
          status: 400,
          message: 'File too large',
        }).end();
      }

      buf = Buffer.concat([buf, chunk]);
    });

    req.on('end', () => {
      let meta = fileType(buf);

      // Sometimes, the file-type module cannot detect the kind of file.
      if (!meta) {
        meta = {};
      }
      let filename = generateFilename();

      // Append the file extension, only if we were able to determine it
      if (meta.ext) {
        filename += '.' + meta.ext;
      }

      let savePath = path.join(uploadDirectory, filename);
      meta.name = filename;
      meta.size = buf.byteLength;
      fse.writeFile(savePath, buf, 'binary', (err) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            code: 'InternalServerError',
            message: 'Unable to upload file: ' + err.message,
          });
        }

        req.fileMeta = meta;
        return next();
      });
    });
  };
};

export default binary;
