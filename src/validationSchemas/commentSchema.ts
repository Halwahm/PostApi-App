import Joi from "@hapi/joi";

export const commentSchema = Joi.object({
  postId: Joi.required(),
  content: Joi.string().required().trim().min(1).max(500)
});
