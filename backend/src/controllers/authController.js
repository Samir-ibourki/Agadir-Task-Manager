import JWT from "jsonwebtoken";
import Users from "../models/Users.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !username || !password) {
      const error = new Error("tous les champs sont requis");
      error.statusCode = 400;
      throw error;
    }

    if (!emailRegex.test(email)) {
      const error = new Error("Email invalide");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const error = new Error(
        "cet email ou nom d'utilisateur est deja utilise"
      );
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const users = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(users.id);

    res.status(201).json({
      success: true,
      message: "utilisateur cree avec succes",
      data: {
        users: {
          id: users.id,
          username: users.username,
          email: users.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email et mot de passe requis");
      error.statusCode = 400;
      throw error;
    }

    const users = await Users.findOne({
      where: { email },
      attributes: ["id", "username", "email", "password"],
    });

    if (!users) {
      const error = new Error("Email ou mot de passe incorrect");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, users.password);

    if (!isPasswordValid) {
      const error = new Error("Email ou mot de passe incorrect");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(users.id);

    res.status(200).json({
      success: true,
      message: "connexion reussie",
      data: {
        users: {
          id: users.id,
          username: users.username,
          email: users.email,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export { login, register };
