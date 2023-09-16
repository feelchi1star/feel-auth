"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function generateSaltedHash(dataToHash, secret) {
    // Generate a random salt
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    // Combine the data and salt
    const saltedData = dataToHash + salt;
    // Create a hash object
    const hash = (0, crypto_1.createHash)("sha256");
    // Update the hash object with the salted data
    hash.update(saltedData);
    // Get the hexadecimal representation of the hash
    const hashedData = hash.digest("hex");
    return hashedData;
}
// Example usage:
const dataToHash = "Hello, World!";
const secret = "mySecret";
const saltedHash = generateSaltedHash(dataToHash, secret);
console.log("Salted Hash:", saltedHash);
