import Joi from "@hapi/joi";
import { Answers } from "../answers";

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required"
  }),
  code: Joi.string().length(5).required().messages({
    "string.length": "Code must be exactly 5 characters long",
    "any.required": "Code is required"
  }),
  newPassword: Joi.string()
    .required()
    .min(6)
    .max(30)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,30}$/)
    .message(Answers.PASSWORD.PASSWORD_HAS_NOT_ALL_NECESSARY_DATA)
});
