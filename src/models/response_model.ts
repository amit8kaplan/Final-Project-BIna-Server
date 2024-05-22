import mongoose, { Schema, model, Document } from "mongoose";

export interface IResponse{
    idPost?: string;
    idDapit?: string;
    idTrainer: string;
    idInstuctor: string;
    nameInstractor: string;
    nameTrainer: string;
    content: string;
    _id?: string;
    date: Date;
}

const responseSchema = new mongoose.Schema<IResponse>({
    idPost: {
        type: String,
    },
    idDapit: {
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
    idTrainer: {
        type: String,
        required: true,
    },
    idInstuctor: {
        type: String,
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