"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieExpiryTime = void 0;
var CookieExpiryTime;
(function (CookieExpiryTime) {
    CookieExpiryTime[CookieExpiryTime["END_OF_SESSION"] = 0] = "END_OF_SESSION";
    CookieExpiryTime[CookieExpiryTime["SECOND"] = 1000] = "SECOND";
    CookieExpiryTime[CookieExpiryTime["MINUTE"] = 60000] = "MINUTE";
    CookieExpiryTime[CookieExpiryTime["HOUR"] = 3600000] = "HOUR";
    CookieExpiryTime[CookieExpiryTime["DAY"] = 86400000] = "DAY";
    CookieExpiryTime[CookieExpiryTime["YEAR"] = 31536000000] = "YEAR";
    CookieExpiryTime[CookieExpiryTime["NEVER"] = 630720000000] = "NEVER";
})(CookieExpiryTime || (exports.CookieExpiryTime = CookieExpiryTime = {}));
