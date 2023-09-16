"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const env_1 = require("../config/env");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(env_1.ENV.cookieParserSecret));
// app.use(express.static("public"));
// Deserialise User and handle refresh and access Token
app.use(authMiddleware_1.deserialiseUser);
//Handles Authentication
app.use("/v1", authRoute_1.default);
// Handle users Information
app.use("/v1/user", userRoute_1.default);
// Error Handling Route
app.use(errorController_1.default);
exports.default = app;
