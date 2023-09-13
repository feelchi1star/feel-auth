import userModel from "@models/userModel";
import AppError from "@utils/appError";
import filterObj from "@utils/filterObj";
import { StatusCodes } from "http-status-codes";
async function updateUser(id: string, data: any) {
  const removeUnWanted = filterObj(data, "username", "email");

  if (data.password) {
    throw new AppError(
      "You can't change password here. Use the change password route",
      StatusCodes.FORBIDDEN
    );
  }
  const user = await userModel.findOneAndUpdate(
    {
      _id: id,
    },
    removeUnWanted,
    {
      new: true,
    }
  );

  return user;
}

export { updateUser };
