"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const env_1 = require("../config/env");
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
const port = process.env.PORT || 8000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(env_1.ENV.DATABASE_URL);
            console.log("Connected to Database Successfully");
            const server = app_1.default.listen(port, () => {
                console.log(env_1.ENV.DATABASE_URL);
                return console.log(`http://localhost:${port}`);
            });
            process.on("unhandledRejection", (err) => {
                console.log("UNHANDLED REJECTION! 💥 Shutting down...");
                //   console.log(err.name, err.message);
                server.close(() => {
                    process.exit(1);
                    main().catch((err) => console.log(err));
                });
            });
        }
        catch (err) {
            console.error("Error connecting to the database:", err);
        }
    });
}
main().catch((err) => console.log(err));
