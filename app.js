import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import petsRouter from "./routes/pets.js";
import authRouter from "./routes/auth.js";
import commentsRouter from "./routes/comments.js";
import followingRouter from "./routes/following.js";

import cors from "cors";
import passport from "passport";
import redisClient from "./services/redis_service.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: process.env.FRONT_END_DOMAIN,
  })
);

//redisClient.connect();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/pets", petsRouter);
app.use("/auth", authRouter);
app.use("/comments", commentsRouter);
app.use("/following", followingRouter);

export default app;
