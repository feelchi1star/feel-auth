"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param fn - You have wrap the Controller Function with catchAsync()
 * @returns void
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
