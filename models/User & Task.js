import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
// Функція для налаштування моделей
export function setupModels() {
  // Модель користувача
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  // Модель завдання
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "tasks",
      timestamps: false,
      indexes: [
        {
          name: "idx_tasks_user_id",
          fields: ["user_id"],
        },
      ],
    }
  );

  const SocialNetwork = sequelize.define(
    "SocialNetwork",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "social_networks",
    }
  );

  // Встановлення асоціацій
  User.hasMany(Task, { foreignKey: "user_id" });
  Task.belongsTo(User, { foreignKey: "user_id" });

  // Додавання хука для автоматичного оновлення updated_at
  Task.beforeUpdate((task) => {
    task.updated_at = new Date();
  });

  return { User, Task, SocialNetwork };
}
