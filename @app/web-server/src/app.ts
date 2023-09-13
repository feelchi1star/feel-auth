import express, { Request, Response } from "express";
import userRoute from "@routes/userRoute";
import authRoute from "@routes/authRoute";
import cookieParser from "cookie-parser";
import errorController from "./controllers/errorController";
import { ENV } from "@config/env";
import { deserialiseUser } from "@middlewares/authMiddleware";
const app = express();
app.use(express.json());
app.use(cookieParser(ENV.cookieParserSecret));

// app.use(express.static("public"));

// Deserialise User and handle refresh and access Token
app.use(deserialiseUser);
//Handles Authentication
app.use("/v1", authRoute);
// Handle users Information
app.use("/v1/user", userRoute);
// Error Handling Route
app.use(errorController);
export default app;
