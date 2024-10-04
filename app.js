import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { CloseConnection, syndDatabase, testConnection } from "./connection.js";
import { setupModels } from "./models/User & Task.js";
export const app = express();

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
  },
  apis: ["./routers/SocalMediaRoutes.js", "app.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

//Прослуховування
app.listen(3000, () => {
  console.log(`Сервер запущений на порті: ${3000}`);
});
//налаштування таблиць та сихнонізація
setupModels();
syndDatabase();
