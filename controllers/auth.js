import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_ACCESS_TOKEN_SERECT = "khoat";
const JWT_ACCESS_TOKEN_EXPIRATION = 10000;
const JWT_REFRESH_TOKEN_SERECT = "khoat1";
const JWT_REFRESH_TOKEN_EXPIRATION = 100000;
// Bcrypt salt
const BCRYPT_SALT = 8;

// Removed
const refreshArray = {};

const { User } = db;

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies["authentication"];
  }

  return jwt;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_ACCESS_TOKEN_SERECT,
};

export class AuthController extends BaseController {
  constructor() {
    super(User);
    this.strategy = new Strategy(jwtOptions, (payload, next) => {
      console.log("payload received", payload);
      const user = this.getUser({ id: payload.id });
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
    // use the strategy
    passport.use(this.strategy);
  }
  getCookieWithJwtAccessToken = async (payload) => {
    const token = await jwt.sign(payload, {
      secret: JWT_ACCESS_TOKEN_SERECT,
      expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION}`,
    });
    let expires = new Date();
    expires.setTime(d.getTime() + JWT_ACCESS_TOKEN_EXPIRATION); // in milliseconds
    return `Authentication=${token}; HttpOnly; Path=/; Expires=${expires.toGMTString()};`;
  };

  getCookieWithJwtRefreshToken = async (payload) => {
    const token = await jwt.sign(payload, {
      secret: JWT_REFRESH_TOKEN_SERECT,
      expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION}`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Expires=${expires.toGMTString()}`;
    return {
      cookie,
      token,
    };
  };

  getUser = async (obj) => {
    return await this._Model.findOne({
      where: obj,
    });
  };
  login = async (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
      const user = await this.getUser({ email });
      if (!user) {
        return res.status(401).json({ msg: "User is not exist" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ msg: "Password is incorrect" });
      }
      // Payload
      const payload = { id: user.id };
      try {
        // Get access token
        const accessToken = await jwt.sign(payload, JWT_ACCESS_TOKEN_SERECT, {
          expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION}`,
        });
        // Get refresh token
        const refreshToken = await jwt.sign(payload, JWT_REFRESH_TOKEN_SERECT, {
          expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION}`,
        });
        // Store: local/database/redis
        refreshArray[refreshToken] = payload;

        res
          .status(200)
          .cookie("authentication", accessToken, {
            expires: new Date(Date.now() + JWT_ACCESS_TOKEN_EXPIRATION),
            //secure: true,
            httpOnly: true,
          })
          .cookie("refresh", refreshToken, {
            expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION),
            //secure: true,
            httpOnly: true,
          })
          .status(200)
          .json({ msg: "Success" });
      } catch (err) {
        res.status(500).json({ msg: "Server got error in logging" });
        throw err;
      }
    }
  };

  register = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      const user = await this.getUser({ email });

      if (user) {
        return res.status(401).json({ msg: "User has already exist" });
      }

      const newUser = {
        email,
        password: bcrypt.hashSync(password, BCRYPT_SALT),
      };
      req.body = newUser;
      return this.create(req, res);
    }
  };
  logout = async (req, res) => {
    res
      .status(200)
      .cookie("authentication", {
        expires: new Date.now(),
        //secure: true,
        httpOnly: true,
      })
      .cookie("refresh", {
        expires: new Date.now(),
        //secure: true,
        httpOnly: true,
      })
      .status(200)
      .json("ok");
  };
}
