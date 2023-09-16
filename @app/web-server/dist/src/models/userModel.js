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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Please provide your email"],
        lowercase: true,
        unique: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email Address"],
    },
    avatar: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
        // validate:[validate.isStrongPassword,"P"]
    },
    status: {
        type: String,
        enum: ["deleted", "suspended", "active"],
        default: "active",
    },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
    timestamps: true,
});
// Middleware
// Virtual Field
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Handles Password Hashing
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Hash Password
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        next();
    });
});
// Instance Methods
userSchema.method("correctPassword", function correctPassword(userPassword, realPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(userPassword, realPassword);
    });
});
userSchema.method("cleanSensitiveField", function cleanSensitiveField() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = this;
        data.password = undefined;
        return data;
    });
});
exports.default = (0, mongoose_1.model)("User", userSchema);
