import mongoose from "mongoose";

export interface IResponse{
    idPost?: mongoose.Schema.Types.ObjectId;
    idDapit?: mongoose.Schema.Types.ObjectId;
    idResponse?: mongoose.Schema.Types.ObjectId;
    idTrainer: mongoose.Schema.Types.ObjectId;
    idInstuctor: mongoose.Schema.Types.ObjectId;
    nameInstractor: string;
    nameTrainer: string;
    content: string;
    _id?: string;
    date: Date;
}

const responseSchema = new mongoose.Schema<IResponse>({
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
    },
    idDapit: {
        type: mongoose.Schema.Types.ObjectId,
    },
    idResponse: {
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
    idTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idInstuctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    nameInstractor: {
        type: String,
        required: true,
    },
    nameTrainer: {
        type: String,
        required: true,
    },
    
});

export default mongoose.model<IResponse>("Response", responseSchema);