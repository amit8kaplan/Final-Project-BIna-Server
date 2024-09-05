import exp from "constants";
import mongoose from "mongoose";

export interface IInstractor{
    name: string;
    _id?: string;
    permissions?: string;
}

const instractorSchema = new mongoose.Schema<IInstractor>({
    name: {
        type: String,
        required: true,
    },
    permissions: {
        type: String,
        required: true,
        enum: ["regular", "group", "admin"],
        default: "regular", // Set default permission to "regular"

    }
});

export default mongoose.model<IInstractor>("Instractor", instractorSchema);