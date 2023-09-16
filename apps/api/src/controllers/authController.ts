import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import catchAsync from "@utils/catchAsync";
import { AsyncRouteHandler } from "feel-auth";
import AppError from "@utils/appError";
import { StatusCodes } from "http-status-codes";

import { CookieExpiryTime } from "@utils/cookieTimeObj";
import { CookieOptions } from "express";
import { ENV } from "@config/env";

import RefreshTokenModel from "@models/refreshTokenModel";
import { successResponseTemplate } from "@utils/boilerplate/response";
const signUp: AsyncRouteHandler<Request, Response, NextFunction> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newUser = await authService.registerUser(req.body);
  if (!newUser) {
    return next(
      new AppError(
        "We are unable to create user",
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );
  }

  res.json({
    msg: "Account created successfully",
    data: newUser,
  });
};

const logIn: AsyncRouteHandler<Request, Response, NextFunction> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email || !req.body.password) {
    return next(
      new AppError(
        "Please Enter Email and Password",
        StatusCodes.NOT_ACCEPTABLE
      )
    );
  }
  const data = await authService.logInUser(req.body.email, req.body.password);

  const NewRefreshTokenSchema = await RefreshTokenModel.create({
    userId: data.user.id,
    token: data.refreshToken,
    deviceInfo: req.headers["user-agent"],
  });

  if (!NewRefreshTokenSchema) {
    return next(
      new AppError(
        "An error occured trying to log you in. Please try again",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }

  const cookieOptions: CookieOptions = {
    maxAge: Number(CookieExpiryTime.DAY) * 60,
    signed: true,
    encode: (d) => encodeURIComponent(d),
    httpOnly: true,
  };

  res.cookie(
    "__feel-token",
    JSON.stringify({
      accessToken: data.accessToken,
      refreshToken: NewRefreshTokenSchema._id,
    }),
    cookieOptions
  );

  return successResponseTemplate(res, "Logged in Successfully", {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: CookieExpiryTime.MINUTE * 15,
  });
};

/**
 * @description This is the Sign up Controller
 */
const WrappedSignUp = catchAsync(signUp);
/**
 * @description This is the Log In Controller
 */
const WrappedLogIn = catchAsync(logIn);
export { WrappedSignUp as signUp, WrappedLogIn as logIn };
