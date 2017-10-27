/**
 * Module Dependencies
 */
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config';

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

/**
  * Start app, Connect to DB & Require Routes
  */

app.listen(config.port, config.hostname, () => {
  // establish connection to mongodb
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.uri, {useMongoClient: true});

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  db.once('open', () => {
    console.log(`Node Version ${process.version}`);
    console.log(`Starting ${config.env} app at ${config.base_url}`);
    console.log(`Quit app with CONTROL-C`);
  });
});
