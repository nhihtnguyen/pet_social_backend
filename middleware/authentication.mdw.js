import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redisClient from "../services/redis_service.js";
dotenv.config();

const JWT_ACCESS_TOKEN_SERECT = process.env.JWT_ACCESS_TOKEN_SERECT || "abc";
const JWT_ACCESS_TOKEN_EXPIRATION =
  process.env.JWT_ACCESS_TOKEN_SERECT || 10000;
const JWT_REFRESH_TOKEN_SERECT = process.env.JWT_ACCESS_TOKEN_SERECT || "abc1";
const JWT_REFRESH_TOKEN_EXPIRATION =
  process.env.JWT_ACCESS_TOKEN_SERECT || 100000;

const authenticate = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // Use passport verify token
    passport.authenticate("jwt", { session: false }),
    // Check and refresh token
  ];
};

export default authenticate;
