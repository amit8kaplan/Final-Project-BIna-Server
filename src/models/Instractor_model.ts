import exp from "constants";
import mongoose from "mongoose";

export interface IInstractor{
    name: string;
    _id?: string;
    email: string;
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
    },
    email: {
        type: String,
        required: true,
        default: "amit88kaplan@gmail.com",
    },
});

export default mongoose.model<IInstractor>("Instractor", instractorSchema);