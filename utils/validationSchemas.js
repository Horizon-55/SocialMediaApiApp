import Joi from "joi";

export const taskSchema = Joi.object().keys({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(1000).required(),
});
