import { Response } from "express";
import { StatusCodes } from "http-status-codes";
/**
 *
 * @param res {Response} This the express response type
 * @param message {string} This is the message you want to pass
 * @param data this can be any data type
 * @returns {Response}
 */
export const successResponseTemplate = (
  res: Response,
  message: string,
  data: any
): Response => {
  return res.status(StatusCodes.OK).json({
    results: Array.isArray(data) ? data.length : undefined,
    responseMessage: message,
    responseBody: data,
  });
};
