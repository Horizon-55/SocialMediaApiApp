import { Sequelize } from "sequelize";
import env from "dotenv";

//підключаємо конфіги із файла та витягуємо значення!
env.config();
const { UsernameDb, PasswordDb, NameServerDB, portDB } = process.env;
export const sequelize = new Sequelize(NameServerDB, UsernameDb, PasswordDb, {
  host: "localhost",
  dialect: "postgres",
  port: portDB,
  logging: console.log,
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Ти успішно з'єднався за базою даних!");
  } catch (error) {
    console.log("Не вдалося підключитися до бази даних:", error);
  }
};
//функція для синхронізації даних із таблиць!
export async function syndDatabase() {
  try {
    await sequelize.sync();
    console.log("База даних успішно синхронізувалась!");
  } catch (error) {
    console.log("Помилка при синхронізації даних", error);
  }
}
//для вставки таблиці функція

async function insertTask(title, description, userId) {
  try {
  } catch (error) {}
}
//функція закриття сервера!
export const CloseConnection = async () => {
  await sequelize.close();
  console.log("З'єднання закрито!");
};
