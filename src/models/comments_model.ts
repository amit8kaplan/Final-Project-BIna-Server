import exp from "constants";
import mongoose from "mongoose";

export interface ICommnet{
    personalName: string;
    content: string;
    _id?: string;
    date: Date;
}
export interface ICommnets{
    comments: Array<{ personalName: string, content: string, date: Date, _id?: string }>;
    count: number;
    idDapitOrPost: string;
    _id?: string;
}

const commentsSchema = new mongoose.Schema<ICommnets>({
    count: {
        type: Number,
        default: 0,
        required: true,
    },
    idDapitOrPost: {
        type: String,
        required: true,
    },
    comments: [{ personalName: String, content: String, date: Date }]

});

export default mongoose.model<ICommnets>("Comments", commentsSchema);