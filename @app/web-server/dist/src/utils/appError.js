"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class AppError - This is custom error class to handle all operational errors in express
 * @description AppError can be used in two ways, when it is in a controller you pass it into the next function params. While when it is a services or normal function you should use the @throws keyword.
 * @example
 * In a controller
 * next(new AppError(message, statusCode))
 *
 * In serivces
 * throw(new AppError(message, statusCode))
 *
 */
class AppError extends Error {
    /**
     *
     * @param message - This Error message you want to display
     * @param statusCode - the status code of the generated
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
