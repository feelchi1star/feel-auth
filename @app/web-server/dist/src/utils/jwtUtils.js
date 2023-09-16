"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env"); // Your secret key
const issuedAtTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
function generateToken(payload, expiresIn = env_1.ENV.jwtExpiresIn) {
    const payloads = {
        // iat: Math.floor(Date.now() / 1000), // "issued at" timestamp (optional)
        // nbf: Math.floor(Date.now() / 1000) + 60, // "not before" timestamp (optional)
        aud: "your-audience",
        sub: "your-subject", // Subject claim (optional)
    };
    return jsonwebtoken_1.default.sign(Object.assign({ payload }, payloads), env_1.ENV.jwtSecretKey, { expiresIn });
}
exports.generateToken = generateToken;
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, env_1.ENV.jwtSecretKey, (err, decodedToken) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return resolve({
                        payload: "",
                        expired: false,
                        iat: 0,
                        exp: 0,
                        aud: "",
                        sub: "",
                    });
                }
                reject(err);
            }
            else {
                resolve(decodedToken);
            }
        });
    });
}
exports.verifyToken = verifyToken;
