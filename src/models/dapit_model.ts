import mongoose from "mongoose";

export const dapitPerformanceSchema = new mongoose.Schema({
    value: Number,
    description: String,
});
export interface IDapit {
    nameInstractor: string;
    namePersonalInstractor: string;
    nameTrainer: string;
    group: string;
    idPersonalInstractor: string;
    _id?: string;
    idInstractor: string;
    idTrainer: string;
    session?: string; // assuming it's optional
    silabus: number;
    date: Date;
    tags?: string[];
    identification: Array<{ value: number, description: string }>;
    payload: Array<{ value: number, description: string }>;
    decryption: Array<{ value: number, description: string }>;
    workingMethod: Array<{ value: number, description: string }>;
    understandingTheAir: Array<{ value: number, description: string }>;
    flight: Array<{ value: number, description: string }>;
    theoretical: Array<{ value: number, description: string }>;
    thinkingInAir: Array<{ value: number, description: string }>;
    safety: Array<{ value: number, description: string }>;
    briefing: Array<{ value: number, description: string }>;
    debriefing: Array<{ value: number, description: string }>;
    debriefingInAir: Array<{ value: number, description: string }>;
    implementationExecise: Array<{ value: number, description: string }>;
    dealingWithFailures: Array<{ value: number, description: string }>;
    dealingWithStress: Array<{ value: number, description: string }>;
    makingDecisions: Array<{ value: number, description: string }>;
    pilotNature: Array<{ value: number, description: string }>;
    crewMember: Array<{ value: number, description: string }>;
    advantage: string[];
    disavantage: string[];
    changeTobeCommender: number;
    finalGrade: number;
    summerize: string;
}



const dapitSchema = new mongoose.Schema<IDapit>({
    nameInstractor: { type: String, required: true },
    namePersonalInstractor: { type: String, required: true },
    nameTrainer: { type: String, required: true },
    group: { type: String, required: true },
    idPersonalInstractor: { type: String, required: true },
    idInstractor: { type: String, required: true },
    idTrainer: { type: String, required: true },
    session: { type: String }, // adjust required based on interface
    silabus: { type: Number, required: true },
    date: { type: Date, required: true },
    tags: { type: [String] },
    identification: [{ value: Number, description: String }],
    payload: [{ value: Number, description: String }],
    decryption: [{ value: Number, description: String }],
    workingMethod: [{ value: Number, description: String }],
    understandingTheAir: [{ value: Number, description: String }],
    flight: [{ value: Number, description: String }],
    theoretical: [{ value: Number, description: String }],
    thinkingInAir: [{ value: Number, description: String }],
    safety: [{ value: Number, description: String }],
    briefing: [{ value: Number, description: String }],
    debriefing: [{ value: Number, description: String }],
    debriefingInAir: [{ value: Number, description: String }],
    implementationExecise: [{ value: Number, description: String }],
    dealingWithFailures: [{ value: Number, description: String }],
    dealingWithStress: [{ value: Number, description: String }],
    makingDecisions: [{ value: Number, description: String }],
    pilotNature: [{ value: Number, description: String }],
    crewMember: [{ value: Number, description: String }],
    advantage: { type: [String] },
    disavantage: { type: [String] },
    changeTobeCommender: { type: Number, min: 4, max: 10 },
    finalGrade: { type: Number, min: 4, max: 10, required: true },
    summerize: { type: String, required: true },
});



export default mongoose.model<IDapit>("Dapit", dapitSchema);

