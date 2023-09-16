"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../config/env");
const errorService_1 = __importDefault(require("../services/errorService"));
const appError_1 = __importDefault(require("../utils/appError"));
const http_status_codes_1 = require("http-status-codes");
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate field value: ${value && value[0]}. Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el === null || el === void 0 ? void 0 : el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default("Authentication Error: We encountered a problem with your login session. Please try logging in again", http_status_codes_1.StatusCodes.UNAUTHORIZED);
const handleJWTExpiredError = () => new appError_1.default("Session Expired: Your login session has expired. Please log in again to continue.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
const errorController = (err, req, res, next) => {
    if (env_1.ENV.NODE_ENV === "development") {
        return errorService_1.default.sendErrorDev(err, req, res);
    }
    if (env_1.ENV.NODE_ENV === "production") {
        if (err instanceof mongoose_1.Error.CastError && err.name === "CastError") {
            return errorService_1.default.sendErrorProd(handleCastErrorDB(err), req, res);
        }
        if (err instanceof mongoose_1.Error.ValidationError &&
            err.name === "ValidationError") {
            return errorService_1.default.sendErrorProd(handleValidationErrorDB(err), req, res);
        }
        if (err instanceof mongodb_1.MongoError &&
            err.name === "MongoError" &&
            err.code === 11000) {
            return errorService_1.default.sendErrorProd(handleDuplicateFieldsDB(err), req, res);
        }
        else if (err.name === "JsonWebTokenError") {
            return errorService_1.default.sendErrorProd(handleJWTError(), req, res);
        }
        else if (err.name === "TokenExpiredError") {
            return errorService_1.default.sendErrorProd(handleJWTExpiredError(), req, res);
        }
        else if (err.name === "TokenInvalidError") {
            return errorService_1.default.sendErrorProd(new appError_1.default("Invalid Session: Your session data is not valid. Please log in again.", http_status_codes_1.StatusCodes.BAD_REQUEST), req, res);
        }
        else if (err.name === "TokenSignatureError") {
            return errorService_1.default.sendErrorProd(new appError_1.default("Session Tampered: We suspect your session data has been tampered with. Please log in again.", http_status_codes_1.StatusCodes.BAD_REQUEST), req, res);
        }
        else if (err.name === "TokenMalformedError") {
            return errorService_1.default.sendErrorProd(new appError_1.default("Session Invalid: We're having trouble processing your session. Please log in again.", http_status_codes_1.StatusCodes.CONFLICT), req, res);
        }
        else if (err.name === "NotBeforeError") {
            return errorService_1.default.sendErrorProd(new appError_1.default("Access Not Allowed Yet: Your access is restricted until a certain time. Please try again later.", http_status_codes_1.StatusCodes.FORBIDDEN), req, res);
        }
        else {
            return errorService_1.default.sendErrorProd(err, req, res);
        }
    }
};
exports.default = errorController;
