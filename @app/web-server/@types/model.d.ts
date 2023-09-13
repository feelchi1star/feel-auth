declare module "model" {
  /**
   * Represents a user object with basic information.
   */
  export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    phoneNumber: string;
    password: string;
    status: "deleted" | "suspended" | "active";
  }

  // User Schema Method Interface
  export interface IUserMethods {
    /**
     *
     * @param userPassword - This is userPassword provided by user in the Req.body
     * @param realPassword - This is the Password stored in the database which can be located at user.password
     * @returns boolean
     */
    correctPassword(userPassword: string, realPassword: string): boolean;
  }

  // User Schema Virtual Interface

  export interface IUserVirtual {
    id: string;
  }

  /**
   * Represent the Client Object with the Client information
   */
  interface Client {
    clientId: string;
    clientSecret: string;
    grants: string[];
    redirectUris: string[];
  }

  /**
   * Represent the Token Object with the Token information
   */
  interface Token {
    accessToken: string;
    accessTokenExpiresAt: Date;
    client: string;
    user: string;
  }

  /**
   * Represent the Client Object with the Client information
   */
  interface authorizationCode {
    authorizationCode: string;
    expiresAt: Date;
    redirectUri: string;
    client: string;
    user: string;
  }

  // Methods

  interface IUserMethods {}

  // IRefreshToken
  export interface IRefreshToken {
    userId: StringSchemaDefinition<string>;
    token: string;
    deviceInfo: string;
    deletedAt: Date;
  }

  // Error

  interface ValidationError {
    errors: Record<string, { message: string }>;
  }

  interface CastError extends Error {
    path: string;
    value: any;
  }
}
