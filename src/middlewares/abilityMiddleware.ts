import { Request, Response, NextFunction } from "express";

import { defineAbilitiesFor } from "../utils/abilityUtil";
import { Action, Resource, IUser } from "../globals";
import { Answers } from "../answers";

export const ability = (action: Action, resource: Resource) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: Answers.AUTH.UNAUTHORIZED });
    const ability = defineAbilitiesFor(req.user as IUser);
    return ability.can(action, resource)
      ? next()
      : res.status(403).json({ message: Answers.AUTH.NO_ACCESS });
  };
};
