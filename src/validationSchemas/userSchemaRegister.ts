import Joi from "@hapi/joi";
import { Answers } from "../answers";

export const userSchemaRegister = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(6)
    .max(30)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,30}$/)
    .message(Answers.PASSWORD.PASSWORD_HAS_NOT_ALL_NECESSARY_DATA),
  avatarImage: Joi.string()
    .regex(/\.(png|jpg|jpeg)$/)
    .optional(),
  profileDescription: Joi.string().allow("").trim().max(1000).optional()
});

export const confirmEmailSchema = Joi.object({
  email: Joi.string().required().trim().min(2).max(50),
  code: Joi.string().required().min(5).max(5)
});
