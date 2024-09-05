import mongoose from "mongoose";

export interface IGroup{
    name: string;
    _id?: string;
    idsTrainers?: string[];
    idsInstractors?: string[];
}

const groupSchema = new mongoose.Schema<IGroup>({
    name: {
        type: String,
        required: true,
    },
    idsTrainers: {
        type: [String],
        required: false,
    },
    idsInstractors: {
        type: [String],
        required: false,
    }
});

export default mongoose.model<IGroup>("Group", groupSchema);