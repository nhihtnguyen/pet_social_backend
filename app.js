import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from "url";
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: process.env.FRONT_END_DOMAIN
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', postsRouter)


export default app;
