import mongoose, { Schema, Document, Model } from "mongoose";

// Define the ISession interface
export interface ISession{
    name: string;
    silabus: number[]; 
}


// Create the Session schema
const SessionSchema = new mongoose.Schema<ISession>({
    name: { type: String, required: true },
    silabus: { type: [Number], required: true }
});

export default mongoose.model<ISession>("Session", SessionSchema);