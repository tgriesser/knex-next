import { makeKnex } from "../../../src/makeKnex";
import { Request, Response, NextFunction } from "express";

interface TKnexMiddlewareOptions {}

export function knexExpress(
  knex: ReturnType<typeof makeKnex>,
  options: TKnexMiddlewareOptions
) {
  return (req: Request, res: Response, next: NextFunction) => {
    return next();
  };
}
