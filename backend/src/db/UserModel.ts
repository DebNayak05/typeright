import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  authentication: {
    password: string;
    sessionToken?: string;
  };
}
const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const getUserBySessionToken = (sessionToken: string) => {
  return UserModel.findOne({ "authentication.sessionToken": sessionToken });
};

export const getUserById = (id: string) => {
  return UserModel.findById(id);
};

// Create User
export const createUser = async (user: {
  name: string;
  email: string;
  authentication: {
    password: string;
    sessionToken?: string;
  };
}) => {
  const newUser = new UserModel(user);
  const savedUser = await newUser.save();
  return savedUser;
};
