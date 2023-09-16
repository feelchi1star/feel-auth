import { ENVTYPE, NodeEnvEnum } from "feel-auth";
const nodeEnv: NodeEnvEnum =
  (process.env.NODE_ENV as NodeEnvEnum) || "development";
const ENV: ENVTYPE = {
  DATABASE_URL: String(process.env.DATABASE_URL) || "",
  PORT: Number(process.env.PORT),
  NODE_ENV: nodeEnv,
  NEXT_PUBLIC_HI: String(process.env.jwtSecretKey) || "",
  jwtSecretKey: String(process.env.jwtSecretKey) || "",
  jwtExpiresIn: String(process.env.jwtExpiresIn) || "1h",
  cookieParserSecret: String(process.env.cookieParserSecret) || "",
};

export { ENV };
