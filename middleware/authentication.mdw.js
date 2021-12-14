import passport from "passport";
const db = require("_helpers/db");

export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // Use passport verify token
    passport.authenticate("jwt", { session: false }),
    // authorize based on user role
    async (req, res, next) => {
      // authentication and authorization successful
      req.user.role = user.role;
      const refreshTokens = await db.RefreshToken.find({ user: user.id });
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
};
