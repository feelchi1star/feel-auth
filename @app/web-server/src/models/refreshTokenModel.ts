import { IRefreshToken, IUserMethods, IUserVirtual, Generics } from "feel-auth";
import mongoose, { Schema, model, Model } from "mongoose";
import bycrpt from "bcryptjs";
type UserModel = Model<IRefreshToken>;

const RefreshTokenSchema = new Schema<IRefreshToken, UserModel, IUserMethods>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",

      required: [true, "Each Token must be associated to a user"],
    },
    token: {
      type: String,
      select: false,
      required: [true, "Sorry!! your session token can't be created"],
    },
    deviceInfo: String,
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// // Handles Password Hashing
// RefreshTokenSchema.pre("save", async function (next) {
//   // Hash Password
//   this.token = await bycrpt.hash(this.token, 12);
//   next();
// });

export default model<IRefreshToken, UserModel>(
  "RefreshToken",
  RefreshTokenSchema
);
