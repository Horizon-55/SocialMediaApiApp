import express from "express";
import { setupModels } from "../models/User & Task.js";
import { loginSchema, registerSchema } from "../utils/validationSchemas.js";

const router = express.Router();
const models = await setupModels();
//тут буде опис API для реєстрування користувачів та авторизація!
/**
 *@swagger
 *components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: ID користувача
 *        username:
 *          type: string
 *          description: Ім'я користувача для реєстрації!
 *        email:
 *          type: string
 *          description: Електрона адреса для реєстрації!
 *        password:
 *          type: string
 *          description: Пароль користувача для авторизації!
 * /register:
 *   post:
 *    summary: API for registration user
 *    description: This API register User in the DataBase
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: Ім'я користувача для реєстрації!
 *            email:
 *              type: string
 *              description: Електрона адреса для реєстрації!
 *            password:
 *              type: string
 *              description: Пароль користувача для авторизації!
 *    responses:
 *          201:
 *           description: The user is successfully registered.
 *           content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 *          400:
 *            description: This user are exist! Or Process check data Validation Error!
 *          500:
 *            description: Server Error
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { error } = registerSchema.validate({
      username,
      email,
      password,
    });

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existingUser = await models.User.findOne({ where: { email: email } });
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
    console.error("Помилка при реєстрації:", error);
    res.status(500).json({
      message: "Помилка при реєстрації користувача!",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * /login:
 *   post:
 *     summary: API Authorization User!
 *     description: This is API Authorization With Login and Password!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful authorization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
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
 *         description: Incorrect login information
 *       401:
 *         description: Incorrect email or password
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({ email, password });
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const User = await models.User.findOne({ where: { email: email } });
    if (!User)
      return res.status(401).json({ message: "Невірний email або пароль" });
    //перевірка пароля поки без захисту! Далі потрібно додати захист bcrypt для встановлення!
    const CheckPassword = await models.User.findOne({
      where: { password: password },
    });
    if (!CheckPassword)
      return res.status(401).json({ message: "Невірний email або пароль" });
    //далі потріна буде генерація токена із JWT для установки!
    res.json({
      message: "Авторизація успішна!",
      user: {
        id: User.id,
        username: User.username,
        email: User.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Внутрішня помилка сервера!" });
  }
});

export default router;
