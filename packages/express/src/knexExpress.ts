import { Request, Response, NextFunction } from "express";

interface TKnexMiddlewareOptions {}

export function knexExpress(knex: any, options: TKnexMiddlewareOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    return next();
  };
}
