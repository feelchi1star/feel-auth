import jwt from "jsonwebtoken";
import { ENV } from "@config/env"; // Your secret key
import AppError from "@utils/appError";
import { StatusCodes } from "http-status-codes";
import { promisify } from "util";
import { TokenPayload } from "feel-auth";
const issuedAtTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
function generateToken(payload: string, expiresIn: string = ENV.jwtExpiresIn) {
  const payloads = {
    // iat: Math.floor(Date.now() / 1000), // "issued at" timestamp (optional)
    // nbf: Math.floor(Date.now() / 1000) + 60, // "not before" timestamp (optional)
    aud: "your-audience", // Audience claim (optional)
    sub: "your-subject", // Subject claim (optional)
  };
  return jwt.sign({ payload, ...payloads }, ENV.jwtSecretKey, { expiresIn });
}

function verifyToken(token: string) {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, ENV.jwtSecretKey, (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return resolve({
            payload: "",
            expired: false,
            iat: 0,
            exp: 0,
            aud: "",
            sub: "",
          } as TokenPayload);
        }
        reject(err);
      } else {
        resolve(decodedToken as TokenPayload);
      }
    });
  });
}

export { generateToken, verifyToken };
