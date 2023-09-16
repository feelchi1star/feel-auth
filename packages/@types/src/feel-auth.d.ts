declare module "feel-auth" {
  export type NodeEnvEnum = "production" | "test" | "development";
  export interface ENVTYPE {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: NodeEnvEnum;
    jwtSecretKey: string;
    jwtExpiresIn: string;
    NEXT_PUBLIC_HI?: string;
    cookieParserSecret: string;
  }

  /**
   * @typeparam Req - Request type
   * @typeparam Res - Response type
   * @typeparam Next - NextFunction type
   * @note All The import should be from the express module
   */
  export type AsyncRouteHandler<Req, Res, Nex> = (
    req: Req,
    res: Res,
    next: Nex
  ) => Promise<Req, Res, Nex>;

  export interface TokenPayload {
    iat: number;
    exp: number;
    payload: string | null;
    aud: string;
    sub: string;
  }
  export interface Generics {
    /**
     * @param fields - This is array of Field you want to remove
     */
    cleanSensitiveField(fields: string[]): Record<string, any>;
  }

  export * from "model";
}
