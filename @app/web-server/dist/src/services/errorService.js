"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
/**
 * @class ErrorHandler class
 */
class ErrorHandler {
    sendErrorDev(err, req, res) {
        //  A) This Applies all api that starts with
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }
    sendErrorProd(err, req, res) {
        return this.__sendProd(err, req, res);
    }
    // private
    /**
     * @note this is just a sub function of the SendErrorProd
     */
    __sendProd(err, req, res) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        return this.renderGenericError(res);
    }
    renderGenericError(res) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
}
exports.default = new ErrorHandler();
