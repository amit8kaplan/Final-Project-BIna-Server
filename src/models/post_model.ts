import mongoose from "mongoose";

export interface IPost{
    idTrainer: mongoose.Schema.Types.ObjectId;
    content: string;
    date: Date;
    responses: mongoose.Schema.Types.ObjectId[];
}

const postSchema = new mongoose.Schema<IPost>({
    idTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
    responses: {
        type: [mongoose.Schema.Types.ObjectId],
    },
});

export default mongoose.model<IPost>("Post", postSchema);