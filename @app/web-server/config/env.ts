import { ENVTYPE, NodeEnvEnum } from "feel-auth";
const nodeEnv: NodeEnvEnum =
  (process.env.NODE_ENV as NodeEnvEnum) || "development";
const ENV: ENVTYPE = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  PORT: Number(process.env.PORT),
  NODE_ENV: nodeEnv,
  NEXT_PUBLIC_HI: process.env.jwtSecretKey || "",
  jwtSecretKey: process.env.jwtSecretKey || "",
  jwtExpiresIn: process.env.jwtExpiresIn || "1h",
  cookieParserSecret: process.env.cookieParserSecret || "",
};

export { ENV };
