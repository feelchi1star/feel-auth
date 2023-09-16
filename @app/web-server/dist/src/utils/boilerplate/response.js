"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponseTemplate = void 0;
const http_status_codes_1 = require("http-status-codes");
/**
 *
 * @param res {Response} This the express response type
 * @param message {string} This is the message you want to pass
 * @param data this can be any data type
 * @returns {Response}
 */
const successResponseTemplate = (res, message, data) => {
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        results: Array.isArray(data) ? data.length : undefined,
        responseMessage: message,
        responseBody: data,
    });
};
exports.successResponseTemplate = successResponseTemplate;
