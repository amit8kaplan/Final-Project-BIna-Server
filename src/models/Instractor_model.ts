import exp from "constants";
import mongoose from "mongoose";

export interface IInstractor{
    name: string;
    _id?: string;
}

const instractorSchema = new mongoose.Schema<IInstractor>({
    name: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IInstractor>("Instractor", instractorSchema);