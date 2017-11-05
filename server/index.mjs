/**
 * Module Dependencies
 */
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import config from './config';
import router from './app/routes';

/**
  * Initialize app
  */
const app = express();

/**
  * Middleware
  */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cors());

const serveStatic = (app) => {
  const f = path.resolve('../client/dist');
  const index = path.join(f, 'index.html');

  app.use(express.static(f));
  app.get('/', (req, res) => {
    res.sendFile(index);
  });

  const apiDocsFolder = path.resolve('./doc');
  const apiDocsIndexFile = path.join(apiDocsFolder, 'index.html');

  app.use(express.static(apiDocsFolder));

  app.get('/docs', (req, res) => {
    if (!fs.existsSync(apiDocsIndexFile)) {
      return res.send('<b>Check back later for API documentation.<b>');
    }

    res.sendFile(apiDocsIndexFile);
  });
};

/**
  * Start app, Connect to DB & Require Routes
  */

app.listen(config.port, config.hostname, () => {
  serveStatic(app);

  // establish connection to mongodb
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.uri, {useMongoClient: true});

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  db.once('open', () => {
    router(app);
    console.log(`Node Version ${process.version}`);
    console.log(`Starting ${config.env} app at ${config.base_url}`);
    console.log(`Quit app with CONTROL-C`);
  });
});
