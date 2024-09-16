import exp from "constants";
import mongoose from "mongoose";

export interface IPersonalInstractor{
    _id?: string;
    idInstractor: string;
    idTrainer: string;
}
const personalInstractorSchema = new mongoose.Schema<IPersonalInstractor>({
    idInstractor: {
        type: String,
        required: true,
    },
    idTrainer: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IPersonalInstractor>("PersonalInstractor", personalInstractorSchema);