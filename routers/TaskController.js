import express from "express";
import { setupModels } from "../models/User & Task.js";
import { taskSchema } from "../utils/validationSchemas.js";

const router = express.Router();
const models = await setupModels();
// Опис API для виводу всіх задач по контенту!
/**
 * @swagger
 * components:
 *   schemas:
 *     tasks:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID tasks
 *         title:
 *           type: string
 *           description: Назва поля
 *         description:
 *           type: string
 *           description: Опис поля має тип поля text
 *         completed:
 *           type: boolean
 *           description: Чи завершенно певне завдання!
 *         created_at:
 *           type: date
 *           description: Дата створення завдання
 *         updated_at:
 *           type: date
 *           description: Коли було оновлення завдання в виді дати!
 *         user_id:
 *           type: integer
 *           description: Посилання із зовнішнього ключа на первинний до таблиці користувача і його Id
 * /tasks:
 *  get:
 *    summary: Get all task
 *    description: This API show the all task from Database!
 *    responses:
 *      200:
 *        description: Successful response.
 *        content:
 *              application/json:
 *                schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/tasks'
 */

router.get("/", async (req, res) => {
  try {
    const GetAllTask = await models.Task.findAll();
    console.log("Завдання отримано:", GetAllTask);
    res.json(GetAllTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Помилка при отриманні задач: ${error.message}` });
  }
});
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Назва поля
 *                description:
 *                  type: string
 *                  description: Опис поля має тип поля text
 *                completed:
 *                  type: boolean
 *                  escription: Чи завершенно певне завдання!
 *     responses:
 *       201:
 *         description: Task was Created!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tasks'
 *       500:
 *         description: Server error
 *       400:
 *         description: Increased characters and Incorect Title!
 */

router.post("/", async (req, res) => {
  try {
    let { title, description, user_id } = req.body;
    const { error } = taskSchema.validate({ title, description });
    if (error) {
      return res.status(400).json({
        message: "Ви ввели не дійсну назву або ввели більше 1000 символів",
      });
    }
    const newTask = await models.Task.create({
      title,
      description,
      user_id,
      completed: false, //за замовчуванням завдання має бути не виконане!
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Помилка при введенні даних: ${error.message}` });
  }
});
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a specific task
 *     description: Retrieve a task by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the task to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tasks'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Не валідний ID задачі" });
    }
    const task = await models.Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задача не знайдена!" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Помилка отриманні задачі: ${error.message}` });
  }
});
/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    summary: Update task by id
 *    description: This API updates task by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Task id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Назва поля
 *              description:
 *                type: string
 *                description: Опис поля має тип поля text
 *              completed:
 *                type: boolean
 *                description: Чи завершенно певне завдання!
 *    responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tasks'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const taskid = req.params.id;
    const task = await models.Task.findByPk(taskid);
    if (!task) {
      return res.status(404).json({ message: "Задача не знайдена!" });
    }
    const updatedTask = await task.update(req.body);
    res.json({ message: "Задача була оновлена успішно!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при оновленні задачі!" });
  }
});
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task by id
 *     description: This API delete task by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id Task for delete!
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task was deleted!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found!
 *       500:
 *         description: Server error!
 */
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await models.Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задачу не знайдено!" });
    }
    await task.destroy();
    res.status(200).json({ message: "Задачу успішно видалено!" });
  } catch (error) {
    console.error("Помилка при видалені задачі:", error);
    res.status(500).json({ message: "Помилка сервера!" });
  }
});
export default router;
