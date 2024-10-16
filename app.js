import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { CloseConnection, syndDatabase } from "./connection.js";
import { setupModels } from "./models/User and Task and SocialMedia.js";
import TaskController from "./routers/TaskController.js";
import UserController from "./routers/UserController.js";
const app = express();

async function startServer() {
  //налаштування таблиць та сихнонізація
  setupModels();
  syndDatabase();

  //Прослуховування
  app.listen(3000, () => {
    console.log(`Сервер запущений на порті: ${3000}`);
  });
}

// Настройка Swagger UI
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS, API project SocialMedia for PostgreSQL",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./routers/TaskController.js",
    "./routers/UserController.js",
    "app.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/tasks", TaskController);
app.use("/auth", UserController);

// Описание API для корневого URL
/**
 * @swagger
 * /:
 *  get:
 *    summary: Main URL
 *    description: This API is used to check if the GET method is working or not.
 *    responses:
 *      200:
 *        description: Successful response.
 */
app.get("/", (req, res) => {
  res.send("Ласкаво просимо через базу даних PostgreSQL");
});

startServer();
export default app;
