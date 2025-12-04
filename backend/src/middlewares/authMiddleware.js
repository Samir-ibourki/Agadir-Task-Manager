import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Users.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "user nout found",
        });
      }

      next();
    } catch (error) {
      console.error("echen in token", error);
      return res.status(401).json({
        success: false,
        message: "token invalid",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "no token dispo",
    });
  }
};
