import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import catchAsync from "@utils/catchAsync";
import { AsyncRouteHandler } from "feel-auth";
import AppError from "@utils/appError";
import { StatusCodes } from "http-status-codes";

import { ENV } from "@config/env";
import { successResponseTemplate } from "@utils/boilerplate/response";

/**
 * @description The Controller get the user profile Information
 */
const getProfileInfo: AsyncRouteHandler<Request, Response, NextFunction> =
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // The need to improve this will raise in the feature
    res.json(req.user);
  });

const updateProfileInfo: AsyncRouteHandler<Request, Response, NextFunction> =
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.updateUser(req.user.id, req.body);
    if (!user) {
      return new AppError("Unable to update profile", StatusCodes.CONFLICT);
    }
    return successResponseTemplate(res, "Updated Profile Successfully", user);
  });
export { getProfileInfo, updateProfileInfo };
