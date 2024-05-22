import mongoose from "mongoose";

export interface IPost{
    idTrainer: string;
    idInstractor: string;
    nameInstractor: string;
    title?: string;
    content: string;
    date: Date;
    _id?: string;
}

const postSchema = new mongoose.Schema<IPost>({
    idTrainer: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export default mongoose.model<IPost>("Post", postSchema);