import mongoose from "mongoose";

export interface ITrainer{
    name: string;
    _id?: string;
}

const trainerSchema = new mongoose.Schema<ITrainer>({
    name: {
        type: String,
        required: true,
    },
});

export default mongoose.model<ITrainer>("Trainer", trainerSchema);

