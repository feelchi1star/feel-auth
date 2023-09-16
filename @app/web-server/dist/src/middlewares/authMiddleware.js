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
exports.deserialiseUser = exports.isAuthenticated = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const JwTUtils = __importStar(require("../utils/jwtUtils"));
const appError_1 = __importDefault(require("../utils/appError"));
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = __importDefault(require("../models/userModel"));
const refreshTokenModel_1 = __importDefault(require("../models/refreshTokenModel"));
const cookieTimeObj_1 = require("../utils/cookieTimeObj");
const env_1 = require("../../config/env");
/**
 * @description The Controller get the user profile Information
 */
const isAuthenticated = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new appError_1.default("Please login to continue", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    return next();
}));
exports.isAuthenticated = isAuthenticated;
const deserialiseUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let BarearToken = req.headers.authorization;
    if (BarearToken && !BarearToken.startsWith("Bearer ")) {
        throw new appError_1.default("Provide a valid authorisation header", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const token = (BarearToken === null || BarearToken === void 0 ? void 0 : BarearToken.split(" ")[0]) || req.signedCookies["__feel-token"];
    const parsedToken = token && JSON.parse(token);
    if (!token) {
        console.log("No token");
        return next();
    }
    const { accessToken, refreshToken } = parsedToken;
    let tokenPayload;
    try {
        const td = yield JwTUtils.verifyToken(accessToken);
        tokenPayload = Object.assign(Object.assign({}, td), { expired: false });
    }
    catch (error) {
        tokenPayload = {
            payload: null,
            expired: error.message.includes("jwt expired"),
        };
    }
    // For a valid access Token
    if (tokenPayload.payload && tokenPayload.expired === false) {
        const user = yield userModel_1.default.findOne({ _id: tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.payload });
        if (!user) {
            return next();
        }
        req.user = user || undefined;
        return next();
    }
    if (!refreshToken) {
        return next();
    }
    const findRefreshToken = yield refreshTokenModel_1.default
        .findOne({
        _id: refreshToken,
        deletedAt: null,
    })
        .select("+token");
    if (!findRefreshToken) {
        return next();
    }
    const VerifyRefreshToken = yield JwTUtils.verifyToken(findRefreshToken.token);
    const newAccessToken = JwTUtils.generateToken(VerifyRefreshToken.payload || "", "15m");
    const cookieOptions = {
        maxAge: Number(cookieTimeObj_1.CookieExpiryTime.DAY) * 60,
        signed: true,
        encode: (d) => encodeURIComponent(d),
        httpOnly: true,
    };
    if (env_1.ENV.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }
    res.cookie("__feel-token", JSON.stringify({
        accessToken: newAccessToken,
        refreshToken,
    }), cookieOptions);
    const verifiedToken = yield JwTUtils.verifyToken(newAccessToken);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.payload)) {
        yield res.cookie("__feel-token", "", {
            maxAge: Number(cookieTimeObj_1.CookieExpiryTime.END_OF_SESSION),
        });
        // Delete Refresh Token
        yield refreshTokenModel_1.default.findByIdAndUpdate({
            _id: refreshToken,
        }, {
            deletedAt: new Date(),
        });
        return next();
    }
    const user = yield userModel_1.default.findOne({
        _id: verifiedToken.payload,
    });
    if (!user) {
        return next();
    }
    req.user = user;
    next();
}));
exports.deserialiseUser = deserialiseUser;
