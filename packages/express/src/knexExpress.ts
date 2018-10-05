import { Request, Response, NextFunction } from "express";

interface TKnexMiddlewareOptions {
  connectionPerRequest?: boolean;
}

export function knexExpress(knex: any, options: TKnexMiddlewareOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    return next();
  };
}
