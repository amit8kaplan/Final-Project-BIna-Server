import exp from "constants";
import mongoose from "mongoose";

export interface ILikes{
    type: string;
    idPostOrDapit: string;
    _id?: string;
}

const likesSchema = new mongoose.Schema<ILikes>({
    type: {
        type: String,
        required: true,
    },
    idPostOrDapit: {
        type: String,
        required: true,
    }
});

export default mongoose.model<ILikes>("Likes", likesSchema);