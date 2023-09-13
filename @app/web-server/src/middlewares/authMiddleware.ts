import { CookieOptions, NextFunction, Request, Response } from "express";
import catchAsync from "@utils/catchAsync";
import { AsyncRouteHandler, IUser } from "feel-auth";
import * as JwTUtils from "@utils/jwtUtils";
import * as authService from "@services/authService";
import AppError from "@utils/appError";
import { StatusCodes } from "http-status-codes";
import userModel from "@models/userModel";
import refreshTokenModel from "@models/refreshTokenModel";
import { CookieExpiryTime } from "@utils/cookieTimeObj";
import { ENV } from "@config/env";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * @description The Controller get the user profile Information
 */

const isAuthenticated: AsyncRouteHandler<Request, Response, NextFunction> =
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError("Please login to continue", StatusCodes.UNAUTHORIZED)
      );
    }

    return next();
  });

const deserialiseUser: AsyncRouteHandler<Request, Response, NextFunction> =
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let BarearToken = req.headers.authorization;

    if (BarearToken && !BarearToken.startsWith("Bearer ")) {
      throw new AppError(
        "Provide a valid authorisation header",
        StatusCodes.BAD_REQUEST
      );
    }

    const token =
      BarearToken?.split(" ")[0] || req.signedCookies["__feel-token"];
    const parsedToken: {
      accessToken: string;
      refreshToken: string;
    } = token && JSON.parse(token);
    if (!token) {
      console.log("No token");
      return next();
    }

    const { accessToken, refreshToken } = parsedToken;

    let tokenPayload;
    try {
      const td = await JwTUtils.verifyToken(accessToken);
      tokenPayload = { ...td, expired: false };
    } catch (error: any) {
      tokenPayload = {
        payload: null,
        expired: error.message.includes("jwt expired"),
      };
    }

    // For a valid access Token
    if (tokenPayload.payload && tokenPayload.expired === false) {
      const user = await userModel.findOne({ _id: tokenPayload?.payload });
      if (!user) {
        return next();
      }
      req.user = user || undefined;
      return next();
    }

    if (!refreshToken) {
      return next();
    }

    const findRefreshToken = await refreshTokenModel
      .findOne({
        _id: refreshToken,
        deletedAt: null,
      })
      .select("+token");

    if (!findRefreshToken) {
      return next();
    }

    const VerifyRefreshToken = await JwTUtils.verifyToken(
      findRefreshToken.token
    );

    const newAccessToken = JwTUtils.generateToken(
      VerifyRefreshToken.payload || "",
      "15m"
    );

    const cookieOptions: CookieOptions = {
      maxAge: Number(CookieExpiryTime.DAY) * 60,
      signed: true,
      encode: (d) => encodeURIComponent(d),
      httpOnly: true,
    };

    if (ENV.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }
    res.cookie(
      "__feel-token",
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken,
      }),
      cookieOptions
    );

    const verifiedToken = await JwTUtils.verifyToken(newAccessToken);

    if (!verifiedToken?.payload) {
      await res.cookie("__feel-token", "", {
        maxAge: Number(CookieExpiryTime.END_OF_SESSION),
      });
      // Delete Refresh Token
      await refreshTokenModel.findByIdAndUpdate(
        {
          _id: refreshToken,
        },
        {
          deletedAt: new Date(),
        }
      );
      return next();
    }

    const user = await userModel.findOne({
      _id: verifiedToken.payload,
    });

    if (!user) {
      return next();
    }
    req.user = user;
    next();
  });

export { isAuthenticated, deserialiseUser };
