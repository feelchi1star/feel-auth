import { authorizationCode } from "feel-auth";
import { Schema, model } from "mongoose";

const AuthorizationCode = new Schema<authorizationCode>({
  authorizationCode: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
  redirectUri: {
    type: String,
  },

  //     client: {
  //       type: String
  //   }

  //     user: {
  //       type: String
  //   }
});

module.exports = model<authorizationCode>(
  "AuthorizationCode",
  AuthorizationCode
);
