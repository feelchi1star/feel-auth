import AppError from "@utils/appError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
/**
 * @class ErrorHandler class
 */
class ErrorHandler {
  sendErrorDev(err: AppError, req: Request, res: Response): Response {
    //  A) This Applies all api that starts with

    return res.status(StatusCodes.OK).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  sendErrorProd(err: AppError, req: Request, res: Response): Response {
    return this.__sendProd(err, req, res);
  }

  // private

  /**
   * @note this is just a sub function of the SendErrorProd
   */
  private __sendProd(err: AppError, req: Request, res: Response): Response {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return this.renderGenericError(res);
  }
  private renderGenericError(res: Response) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
}

export default new ErrorHandler();
