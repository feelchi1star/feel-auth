import { IUser, IUserMethods, IUserVirtual, Generics } from "feel-auth";
import { Schema, model, Model } from "mongoose";
import bycrpt from "bcryptjs";
import validate from "validator";

type UserModel = Model<IUser, {}, IUserMethods & Generics, IUserVirtual>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      unique: true,
      validate: [validate.isEmail, "Please provide a valid email Address"],
    },
    avatar: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
      // validate:[validate.isStrongPassword,"P"]
    },
    status: {
      type: String,
      enum: ["deleted", "suspended", "active"],
      default: "active",
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

// Middleware

// Virtual Field

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Handles Password Hashing
userSchema.pre("save", async function (next) {
  // Hash Password
  this.password = await bycrpt.hash(this.password, 12);
  next();
});

// Instance Methods

userSchema.method(
  "correctPassword",
  async function correctPassword(userPassword: string, realPassword: string) {
    return bycrpt.compare(userPassword, realPassword);
  }
);

userSchema.method("cleanSensitiveField", async function cleanSensitiveField() {
  const data = this;
  data.password = undefined;
  return data;
});

export default model<IUser, UserModel>("User", userSchema);
