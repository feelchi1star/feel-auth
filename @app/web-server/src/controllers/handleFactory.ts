import { successResponseTemplate } from "@utils/boilerplate/response";
import catchAsync from "@utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { Model, Document, FilterQuery } from "mongoose";

// Define a generic type for the request body
interface RequestWithBody<T> extends Request {
  body: T;
}

/**
@description Create a reusable function to create one document
 *  */
export const createOne = (ModelObj: Model<Document>, message?: string) => {
  return catchAsync(
    async (req: RequestWithBody<any>, res: Response, next: NextFunction) => {
      const doc = await ModelObj.create(req.body);
      res.status(201).json(doc);
    }
  );
};
export const findAll = (ModelObj: Model<Document>, message?: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    return successResponseTemplate(
      res,
      message ? message : "Query Successful",
      await ModelObj.find()
    );
  });
};

// find One
export const findOne = <T>(
  ModelObj: Model<Document>,
  fields: FilterQuery<T>,
  message?: string
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    return successResponseTemplate(
      res,
      message ? message : "Query Successful",
      await ModelObj.findOne(fields)
    );
  });
};
