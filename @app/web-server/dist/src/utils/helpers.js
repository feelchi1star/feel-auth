"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBase64Url = exports.encodeBase64Url = void 0;
const encodeBase64Url = (str, option = "base64url") => {
    let txt;
    txt = Buffer.from(`${str}`).toString(option);
    return txt;
};
exports.encodeBase64Url = encodeBase64Url;
const decodeBase64Url = (str, option = "base64url") => {
    return Buffer.from(`${str}`, option).toString("ascii");
};
exports.decodeBase64Url = decodeBase64Url;
