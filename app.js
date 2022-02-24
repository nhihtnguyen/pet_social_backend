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
import votingRouter from "./routes/voting.js";
import eventsRouter from "./routes/events.js";
import searchRouter from "./routes/search.js";
import participantsRouter from "./routes/participants.js";

import cors from "cors";
import passport from "passport";
import redisClient from "./services/redis_service.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

let whitelist = process.env.FRONT_END_DOMAIN;
whitelist = whitelist ? whitelist.split(",") : [];

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

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
app.use("/voting", votingRouter);
app.use("/search", searchRouter);
app.use("/events", eventsRouter);
app.use("/participants", participantsRouter);

app.use(function (req, res, next) {
  res.status(404).json({
    error_message: "Endpoint not found",
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error_message: "Something broke !!!!!",
  });
});

export default app;
