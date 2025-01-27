import { Schema } from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export const validateDataMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      res.status(400).json({ error: errorMessage });
    } else next();
  };
};
