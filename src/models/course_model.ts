import mongoose from "mongoose";
import {IUser} from "./user_model";
export interface ICourse {
    name: string;
    _id: string;
    owner?: IUser;
    description?: string;
    Count: number;
}

const couseSchema = new mongoose.Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
  },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    description: {
        type: String,
    },
    Count: {
        type: Number,
        required: true,
    },
});

export default mongoose.model<ICourse>("Course", couseSchema);
