import Joi from "@hapi/joi";
import { Answers } from "../answers";

export const userSchemaAuth = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(6)
    .max(30)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,30}$/)
    .message(Answers.PASSWORD.PASSWORD_HAS_NOT_ALL_NECESSARY_DATA)
});
