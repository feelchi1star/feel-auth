import { IUser } from "feel-auth";
import UserModel from "@models/userModel";
import AppError from "@utils/appError";
import { StatusCodes } from "http-status-codes";
import * as JwTUtils from "@utils/jwtUtils";
import { Request } from "express";

async function registerUser(payload: IUser) {
  const { email, password } = payload;
  const user: IUser | null = await UserModel.findOne({
    email: email.toLowerCase(),
  });

  if (user) {
    throw new AppError(
      "This email already exist, try another one",
      StatusCodes.CONFLICT
    );
  }
  const newUser: IUser = await UserModel.create({ email, password });

  return newUser;
}

async function logInUser(email: string, password: string) {
  const user = await UserModel.findOne({
    email,
  }).select("password");

  if (!user || !(await user?.correctPassword(password, user.password))) {
    throw new AppError("Incorrect Email or Password", StatusCodes.UNAUTHORIZED);
  }

  // Access Token
  const accessToken = JwTUtils.generateToken(user.id, "15m");
  const refreshToken = JwTUtils.generateToken(user.id, "1y");

  return { user: { password, id: user.id }, accessToken, refreshToken };
}
/**
 *
 * @param req - {Request}
 * @description  this returns the Secure Token Object
 */
function TokenData(req: Request): {
  accessToken: string;
  refreshToken: string;
} {
  let BarearToken = req.headers.authorization;

  if (BarearToken && !BarearToken.startsWith("Bearer ")) {
    throw new AppError(
      "Provide a valid authorisation header",
      StatusCodes.BAD_REQUEST
    );
  }

  const token = BarearToken?.split(" ")[0] || req.signedCookies["__feel-token"];
  const parsedToken = token && JSON.parse(token);
  console.log(token);

  return parsedToken;
}

export { registerUser, logInUser, TokenData };
