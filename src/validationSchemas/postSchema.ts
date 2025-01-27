import Joi from "@hapi/joi";

const hashtagSchema = Joi.string().trim().min(2).max(50);
export const postSchema = Joi.object({
  name: Joi.string().required().trim().min(4).max(255),
  content: Joi.string().allow("").trim().max(2000).optional(),
  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().allow(null).optional(),
  deletedAt: Joi.date().iso().allow(null).optional(),
  // photos: Joi.string()
  //   .regex(/\.(png|jpg|jpeg)$/)
  //   .required(),
  hashtags: Joi.alternatives()
    .try(hashtagSchema, Joi.array().items(hashtagSchema).min(1))
    .optional()
});
