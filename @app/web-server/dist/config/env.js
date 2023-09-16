"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const nodeEnv = process.env.NODE_ENV || "development";
const ENV = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    PORT: Number(process.env.PORT),
    NODE_ENV: nodeEnv,
    NEXT_PUBLIC_HI: process.env.jwtSecretKey || "",
    jwtSecretKey: process.env.jwtSecretKey || "",
    jwtExpiresIn: process.env.jwtExpiresIn || "1h",
    cookieParserSecret: process.env.cookieParserSecret || "",
};
exports.ENV = ENV;
