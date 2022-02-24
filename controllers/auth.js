import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import redisClient from "../services/redis_service.js";
import { Magic } from "@magic-sdk/admin";
const magic = new Magic(process.env.MAGIC_SECRET_KEY);
dotenv.config();

const JWT_ACCESS_TOKEN_SERECT = process.env.JWT_ACCESS_TOKEN_SERECT || "abc";
const JWT_ACCESS_TOKEN_EXPIRATION =
  Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION) || 3600;
const JWT_REFRESH_TOKEN_SERECT = process.env.JWT_REFRESH_TOKEN_SERECT || "abc1";
const JWT_REFRESH_TOKEN_EXPIRATION =
  Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION) || 604800;
const NODE_ENV = process.env.NODE_ENV;
// Bcrypt salt
const BCRYPT_SALT = process.env.BCRYPT_SALT || 8;

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
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_ACCESS_TOKEN_SERECT,
};

export class AuthController extends BaseController {
  constructor() {
    super(User);
    this.strategy = new Strategy(jwtOptions, async (payload, next) => {
      console.log(payload);
      const user = await this.getUser({ email: payload.email });
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
    // use the strategy
    passport.use(this.strategy);
  }

  getUser = async (obj) => {
    return await this._Model.findOne({
      where: obj,
    });
  };

  login = async (req, res) => {
    try {
      const didToken = req.headers.authorization.substr(7);

      await magic.token.validate(didToken);

      const metadata = await magic.users.getMetadataByToken(didToken);

      let user = await this.getUser({ email: metadata.email });

      // Check if new user, create a register into database
      if (!user) {
        try {
          const { first_name, last_name } = req.body;

          const newUser = {
            email: metadata.email,
            first_name,
            last_name,
          };
          req.body = newUser;
          user = await this._Model.create(req.body);
        } catch (error) {
          res.status(400).json(err);
        }
      }

      // Create JWT with information about the user, expires in `SESSION_LENGTH_IN_DAYS`, and signed by `JWT_SECRET`
      const accessToken = await jwt.sign(metadata, JWT_ACCESS_TOKEN_SERECT, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION,
      });
      const refreshToken = await jwt.sign(metadata, JWT_REFRESH_TOKEN_SERECT, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
      });

      refreshArray[refreshToken] = metadata;
      console.log("JWT", JWT_REFRESH_TOKEN_EXPIRATION);
      res
        .status(200)
        .cookie("refresh", refreshToken, {
          expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION * 1000),
          secure: NODE_ENV === "production",
          httpOnly: true,
          sameSite: "none",
        })
        .json({ msg: "Success", accessToken, metadata })
        .end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server got error in logging" });
    }
  };

  register = async (req, res) => {
    try {
      const didToken = req.headers.authorization.substr(7);

      await magic.token.validate(didToken);

      const metadata = await magic.users.getMetadataByToken(didToken);

      const user = await this.getUser({ email: metadata.email });

      // Check if new user, create a register into database
      if (!user) {
        const { first_name, last_name } = req.body;

        const newUser = {
          email,
          first_name,
          last_name,
        };
        req.body = newUser;
        await this.create(req, res);
      }

      // Create JWT with information about the user, expires in `SESSION_LENGTH_IN_DAYS`, and signed by `JWT_SECRET`
      const accessToken = await jwt.sign(metadata, JWT_ACCESS_TOKEN_SERECT, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRATION,
      });
      const refreshToken = await jwt.sign(metadata, JWT_REFRESH_TOKEN_SERECT, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
      });

      refreshArray[refreshToken] = metadata;

      res
        .status(200)
        .cookie("refresh", refreshToken, {
          expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION),
          secure: NODE_ENV === "production",
          httpOnly: true,
        })
        .json({ msg: "Success", accessToken, metadata })
        .end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server got error in logging" });
    }
  };

  logout = async (req, res) => {
    try {
      const token = req.cookies.refresh;

      if (!token) {
        return res.status(401).json({ message: "User is not logged in" });
      }

      let user = jwt.verify(token, JWT_REFRESH_TOKEN_SERECT);

      try {
        await magic.users.logoutByIssuer(user.issuer);
      } catch (error) {
        console.log("Users session with Magic already expired");
      }

      res
        .status(302)
        .cookie("refresh", {
          expires: Date.now(),
          httpOnly: true,
        })
        .end();
      res.end();
    } catch (error) {
      res.status(400).json({ message: "Unexpected error" });
    }
  };

  refresh = async (req, res) => {
    const refreshToken = req.cookies["refresh"];
    let payload = null;
    //
    payload = refreshArray[refreshToken];
    /* // Redis
    payload = await new Promise((resolve, reject) => {
      try {
        redisClient.mGet(refreshToken, (err, reply) => {
          if (err) throw err;
          payload = JSON.parse(reply);

          resolve(payload);
        });
      } catch (error) {
        reject(error);
      }
    });
    */

    if (refreshToken && payload) {
      try {
        jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SERECT);
        const token = await jwt.sign(payload, JWT_ACCESS_TOKEN_SERECT, {
          expiresIn: JWT_ACCESS_TOKEN_EXPIRATION,
        });
        return res
          .status(200)
          .json({ msg: "Refresh Success", accessToken: token })
          .end();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          msg: "Invalid refresh token",
        });
      }
    } else {
      res.status(500).json({ msg: "Invalid request" });
    }
  };
  revokeRefreshToken = (req, res) => {
    const refreshToken = req.cookies["refresh"];

    try {
      /* redisClient.get(refreshToken, (err, reply) => {
        if (err) throw err;
        redisClient.del(refreshToken, (err, reply) => {
          console.log("reject", reply);
        });
      });*/
      delete refreshArray[refreshToken];
      res.status(200).json({ msg: "Revoke success" });
    } catch (error) {
      console.log(error);
    }
  };
}
