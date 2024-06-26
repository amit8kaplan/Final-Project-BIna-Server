import mongoose from "mongoose";

export interface IWall{
    idTrainer: string;
    dapits: mongoose.Schema.Types.ObjectId[];
    posts: mongoose.Schema.Types.ObjectId[];
}

const wallSchema = new mongoose.Schema<IWall>({
    idTrainer: {
        type: String,
        required: true,
    },
    dapits: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
    },
});

export default mongoose.model<IWall>("Wall", wallSchema);

