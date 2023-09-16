"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AuthorizationCode = new mongoose_1.Schema({
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
module.exports = (0, mongoose_1.model)("AuthorizationCode", AuthorizationCode);
