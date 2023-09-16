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
exports.updateUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const filterObj_1 = __importDefault(require("../utils/filterObj"));
const http_status_codes_1 = require("http-status-codes");
function updateUser(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const removeUnWanted = (0, filterObj_1.default)(data, "username", "email");
        if (data.password) {
            throw new appError_1.default("You can't change password here. Use the change password route", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        const user = yield userModel_1.default.findOneAndUpdate({
            _id: id,
        }, removeUnWanted, {
            new: true,
        });
        return user;
    });
}
exports.updateUser = updateUser;
