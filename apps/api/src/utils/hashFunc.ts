import { createHash, randomBytes } from "crypto";

function generateSaltedHash(dataToHash: string, secret: string): string {
  // Generate a random salt
  const salt = randomBytes(16).toString("hex");

  // Combine the data and salt
  const saltedData = dataToHash + salt;

  // Create a hash object
  const hash = createHash("sha256");

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
