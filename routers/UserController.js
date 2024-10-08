import express from "express";
import { setupModels } from "../models/User & Task.js";

const router = express.Router();
const models = await setupModels();
//тут буде опис API для реєстрування користувачів та авторизація!
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: field register Username
 *               email:
 *                 type: string
 *                 description: field register email address of User
 *               password:
 *                 type: string
 *                  description: field register Password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error registering user
 */
router.post("/register", async (req, res) => {
  //пізніше при потребі потрібно зашифрування пароля від пакета bcrypt...
  try {
    const { username, email, password } = req.body;
    const existingUser = await models.User.findOne({ where: email });
    if (existingUser)
      return res.status(400).json({ message: "Такий користувач вже існує!" });

    const newUser = await models.User.create({
      username,
      email,
      password,
    });
    res.status(201).json({
      message: "Користувача успішно зареєстровано!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Помилка при реєстрації користувача!",
      error: error.message,
    });
  }
});
