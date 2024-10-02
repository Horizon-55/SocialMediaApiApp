import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

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
        url: "http://localhost:3000", // Используйте url вместо api
      },
    ],
  },
  apis: ["./routes/*.js"], // Укажите файлы с описанием API
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Прослуховування
app.listen(3000, () => {
  console.log("Сервер запущений на порті: 3000");
});
