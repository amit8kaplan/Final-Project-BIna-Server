import mongoose from "mongoose";

export interface IResponse{
    idPost?: mongoose.Schema.Types.ObjectId;
    idDapit?: mongoose.Schema.Types.ObjectId;
    content: string;
    date: Date;
}

const responseSchema = new mongoose.Schema<IResponse>({
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
    },
    idDapit: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model<IResponse>("Response", responseSchema);