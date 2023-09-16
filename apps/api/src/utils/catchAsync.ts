import { NextFunction, Request, Response } from "express";
import { AsyncRouteHandler } from "feel-auth";

/**
 *
 * @param fn - You have wrap the Controller Function with catchAsync()
 * @returns void
 */
const catchAsync = (fn: AsyncRouteHandler<Request, Response, NextFunction>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
