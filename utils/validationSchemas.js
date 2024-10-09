import Joi from "joi";

export const taskSchema = Joi.object().keys({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(1000).required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Пароль повинен містити мінімум 8 символів, включаючи велику літеру, малу літеру та цифру",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
