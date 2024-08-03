import exp from "constants";
import mongoose from "mongoose";

export interface ILikes{
    count: number;
    idDapitOrPost: string;
    flag: boolean;
    _id?: string;
}

const likesSchema = new mongoose.Schema<ILikes>({
    count: {
        type: Number,
        default: 0,
        required: true,
    },
    idDapitOrPost: {
        type: String,
        required: true,
    },
    flag: {
        type: Boolean,
        default: false,
        required: true,
    },
});

export default mongoose.model<ILikes>("Likes", likesSchema);