import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import BaseController from './base_controller.js';
import db from '../models/index.cjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import redisClient from '../services/redis_service.js';
dotenv.config();

const JWT_ACCESS_TOKEN_SERECT = process.env.JWT_ACCESS_TOKEN_SERECT || 'abc';
const JWT_ACCESS_TOKEN_EXPIRATION =
  Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION) || 10000;
const JWT_REFRESH_TOKEN_SERECT = process.env.JWT_REFRESH_TOKEN_SERECT || 'abc1';
const JWT_REFRESH_TOKEN_EXPIRATION =
  Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION) || 100000;
// Bcrypt salt
const BCRYPT_SALT = process.env.BCRYPT_SALT || 8;

// Removed
const refreshArray = {};

const { User } = db;

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['authentication'];
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
    this.strategy = new Strategy(jwtOptions, async (payload, next) => {
      const user = await this.getUser({ id: payload.id });
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
    try {
      let userObj = await this._Model.findOne({
        where: obj,
      });
      return userObj;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await this.getUser({ email });
        if (!user) {
          return res.status(401).json({ msg: 'User is not exist' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ msg: 'Password is incorrect' });
        }
        // Payload
        const payload = { id: user.id };
        try {
          // Get access token
          console.log(JWT_REFRESH_TOKEN_EXPIRATION);
          const accessToken = await jwt.sign(payload, JWT_ACCESS_TOKEN_SERECT, {
            expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION}`,
          });
          // Get refresh token
          const refreshToken = await jwt.sign(
            payload,
            JWT_REFRESH_TOKEN_SERECT,
            {
              expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION}`,
            }
          );
          // Store: local/database/redis
          refreshArray[refreshToken] = payload;
          // Redis

          try {
            /* redisClient.set(
              refreshToken,
              JSON.stringify(payload),
              (err, reply) => {
                if (err) throw err;
                console.log(reply);
                redisClient.expire(
                  refreshToken,
                  JWT_REFRESH_TOKEN_EXPIRATION,
                  (err, reply) => {
                    if (err) throw err;
                    console.log(reply);
                    redisClient.get(refreshToken, (err, reply) => {
                      if (err) throw err;
                    });
                  }
                );
              }
            );
            */

            res
              .status(200)
              .cookie('authentication', accessToken, {
                expires: new Date(Date.now() + JWT_ACCESS_TOKEN_EXPIRATION),
                //secure: true,
                httpOnly: true,
              })
              .cookie('refresh', refreshToken, {
                expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION),
                //secure: true,
                httpOnly: true,
              })
              .status(200)
              .json({ msg: 'Success' });
          } catch (error) {
            console.log(error);
          }
        } catch (err) {
          res.status(500).json({ msg: 'Server got error in logging' });
          throw err;
        }
      }
    } catch (e) {
      console.log('Login..........', e);
      res.status(500).json({ msg: 'Server error' });
    }
  };

  register = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email && password) {
        const user = await this.getUser({ email });

        if (user) {
          return res.status(401).json({ msg: 'User has already exist' });
        }

        const newUser = {
          email,
          password: bcrypt.hashSync(password, BCRYPT_SALT),
        };
        req.body = newUser;
        return this.create(req, res);
      }
    } catch (e) {
      console.log('Register.........', e);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  logout = async (req, res) => {
    try {
      res
        .status(200)
        .cookie('authentication', {
          expires: Date.now(),
          //secure: true,
          httpOnly: true,
        })
        .cookie('refresh', {
          expires: Date.now(),
          //secure: true,
          httpOnly: true,
        })
        .status(200)
        .json('ok');
    } catch (e) {
      console.log('Logout.........', e);
      res.status(500).json({ msg: 'Server error' });
    }
  };

  refresh = async (req, res) => {
    try {
      const refreshToken = req.cookies['refresh'];
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
            expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION}`,
          });
          return res
            .cookie('authentication', token, {
              expires: new Date(Date.now() + JWT_ACCESS_TOKEN_EXPIRATION),
              //secure: true,
              httpOnly: true,
            })
            .status(200)
            .json('Refresh token success')
            .end();
        } catch (error) {
          console.error(error);
          res.status(500).json({
            msg: 'Invalid refresh token',
          });
        }
      } else {
        res.status(500).json({ msg: 'Invalid request' });
      }
    } catch (e) {
      console.log('Refresh.......', e);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  revokeRefreshToken = (req, res) => {
    try {
      const refreshToken = req.cookies['refresh'];

      try {
        /* redisClient.get(refreshToken, (err, reply) => {
          if (err) throw err;
          redisClient.del(refreshToken, (err, reply) => {
            console.log("reject", reply);
          });
        });*/
        delete refreshArray[refreshToken];
        res.status(200).json({ msg: 'Revoke success' });
      } catch (error) {
        console.log(error);
      }
    } catch (e) {
      console.log('Revoke RefreshToken.......', e);
      res.status(500).json({ msg: 'Server error' });
    }
  };
}
