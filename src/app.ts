import { merge } from 'config-plus';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { json } from 'express';
import { allow, loadTemplates, MiddlewareLogger } from 'express-ext';
import http from 'http';
import { createLogger } from 'logger-core';
import { Pool } from 'pg';
import { PoolManager } from 'pg-extension';
import { log } from 'query-core';
import { buildTemplates, trim } from 'query-mappers';
import { config, env } from './config';
import { useContext } from './context';
import { route } from './route';

dotenv.config();
const conf = merge(config, process.env, env, process.env.ENV);

const logger = createLogger(conf.log);
const middleware = new MiddlewareLogger(logger.info, conf.middleware);
const app = express();

app.use(allow(conf.allow), json(), cookieParser(), middleware.log);
const templates = loadTemplates(conf.template, buildTemplates, trim, [
  './configs/article.xml',
  './configs/cinema.xml',
  './configs/comment.xml',
  './configs/company.xml',
  './configs/film.xml',
  './configs/item.xml',
  './configs/job.xml',
  './configs/location.xml',
  './configs/user.xml',
]);
// const templates = loadTemplates(conf.template, buildTemplates, trim, ['./configs/job.xml']);
const db = log(new PoolManager(new Pool(conf.db.user)), true, logger, 'postgres');
const pool = new Pool(conf.db.query);
const queryDB = new PoolManager(pool);
const ctx = useContext(
  db,
  queryDB,
  logger,
  middleware,
  conf,
  templates
);
route(app, ctx);
http.createServer(app).listen(conf.port, () => {
  console.log('Start server at port ' + conf.port);
});
