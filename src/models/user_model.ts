import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
  user_name: string;
  imgUrl?: string;
  _id?: string;
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser, Document>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
