import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { ENV } from "@config/env";
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 8000;

async function main() {
  try {
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("Connected to Database Successfully");
    const server = app.listen(port, () => {
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
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

main().catch((err) => console.log(err));
