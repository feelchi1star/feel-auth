"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.signUp = void 0;
const authService = __importStar(require("../services/authService"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const http_status_codes_1 = require("http-status-codes");
const cookieTimeObj_1 = require("../utils/cookieTimeObj");
const refreshTokenModel_1 = __importDefault(require("../models/refreshTokenModel"));
const response_1 = require("../utils/boilerplate/response");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield authService.registerUser(req.body);
    if (!newUser) {
        return next(new appError_1.default("We are unable to create user", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY));
    }
    res.json({
        msg: "Account created successfully",
        data: newUser,
    });
});
const logIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return next(new appError_1.default("Please Enter Email and Password", http_status_codes_1.StatusCodes.NOT_ACCEPTABLE));
    }
    const data = yield authService.logInUser(req.body.email, req.body.password);
    const NewRefreshTokenSchema = yield refreshTokenModel_1.default.create({
        userId: data.user.id,
        token: data.refreshToken,
        deviceInfo: req.headers["user-agent"],
    });
    if (!NewRefreshTokenSchema) {
        return next(new appError_1.default("An error occured trying to log you in. Please try again", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
    const cookieOptions = {
        maxAge: Number(cookieTimeObj_1.CookieExpiryTime.DAY) * 60,
        signed: true,
        encode: (d) => encodeURIComponent(d),
        httpOnly: true,
    };
    res.cookie("__feel-token", JSON.stringify({
        accessToken: data.accessToken,
        refreshToken: NewRefreshTokenSchema._id,
    }), cookieOptions);
    return (0, response_1.successResponseTemplate)(res, "Logged in Successfully", {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: cookieTimeObj_1.CookieExpiryTime.MINUTE * 15,
    });
});
/**
 * @description This is the Sign up Controller
 */
const WrappedSignUp = (0, catchAsync_1.default)(signUp);
exports.signUp = WrappedSignUp;
/**
 * @description This is the Log In Controller
 */
const WrappedLogIn = (0, catchAsync_1.default)(logIn);
exports.logIn = WrappedLogIn;
