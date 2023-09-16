"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description  this filters out unwanted field in as object
 */
exports.default = (obj, ...notAllowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (!notAllowedFields.includes(el))
            newObj[el] = obj[el];
    });
    console.log(newObj);
    return newObj;
};
