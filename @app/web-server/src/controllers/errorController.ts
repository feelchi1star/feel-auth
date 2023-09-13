import { ENV } from "@config/env";
import errorService from "@services/errorService";
import AppError from "@utils/appError";
import { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { MongoAPIError, MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";
// Define a custom type for the expected error types
type CustomErrorType =
  | AppError
  | MongoAPIError
  | MongooseError.CastError
  | MongooseError.ValidationError;
const handleCastErrorDB = (err: MongooseError.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError): AppError => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);

  const message = `Duplicate field value: ${
    value && value[0]
  }. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (
  err: MongooseError.ValidationError
): AppError => {
  const errors = Object.values(err.errors).map((el) => el?.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError(
    "Authentication Error: We encountered a problem with your login session. Please try logging in again",
    StatusCodes.UNAUTHORIZED
  );

const handleJWTExpiredError = (): AppError =>
  new AppError(
    "Session Expired: Your login session has expired. Please log in again to continue.",
    StatusCodes.UNAUTHORIZED
  );

const errorController = (
  err: CustomErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (ENV.NODE_ENV === "development") {
    return errorService.sendErrorDev(err as AppError, req, res);
  }
  if (ENV.NODE_ENV === "production") {
    if (err instanceof MongooseError.CastError && err.name === "CastError") {
      return errorService.sendErrorProd(handleCastErrorDB(err), req, res);
    }
    if (
      err instanceof MongooseError.ValidationError &&
      err.name === "ValidationError"
    ) {
      return errorService.sendErrorProd(handleValidationErrorDB(err), req, res);
    }
    if (
      err instanceof MongoError &&
      err.name === "MongoError" &&
      err.code === 11000
    ) {
      return errorService.sendErrorProd(handleDuplicateFieldsDB(err), req, res);
    } else if (err.name === "JsonWebTokenError") {
      return errorService.sendErrorProd(handleJWTError(), req, res);
    } else if (err.name === "TokenExpiredError") {
      return errorService.sendErrorProd(handleJWTExpiredError(), req, res);
    } else if (err.name === "TokenInvalidError") {
      return errorService.sendErrorProd(
        new AppError(
          "Invalid Session: Your session data is not valid. Please log in again.",
          StatusCodes.BAD_REQUEST
        ),
        req,
        res
      );
    } else if (err.name === "TokenSignatureError") {
      return errorService.sendErrorProd(
        new AppError(
          "Session Tampered: We suspect your session data has been tampered with. Please log in again.",
          StatusCodes.BAD_REQUEST
        ),
        req,
        res
      );
    } else if (err.name === "TokenMalformedError") {
      return errorService.sendErrorProd(
        new AppError(
          "Session Invalid: We're having trouble processing your session. Please log in again.",
          StatusCodes.CONFLICT
        ),
        req,
        res
      );
    } else if (err.name === "NotBeforeError") {
      return errorService.sendErrorProd(
        new AppError(
          "Access Not Allowed Yet: Your access is restricted until a certain time. Please try again later.",
          StatusCodes.FORBIDDEN
        ),
        req,
        res
      );
    } else {
      return errorService.sendErrorProd(err as AppError, req, res);
    }
  }
};

export default errorController;
