import mongoose from "mongoose";

const dapitPerformanceSchema = new mongoose.Schema({
    value: Number,
    description: String,
});
export interface IDapit {
    nameInstractor: string;//the name of the Instractor that plight with him
    namePersonalInstractor: string; // the nmame of the personal instractor
    nameTrainer: string;
    group: string; // group == megama
    idPersonalInstractor: string; // this is the personal instractor id
    _id?: string;
    idInstractor: string; // this is the Instractor id
    idTrainer: string; // this is the Trainer id
    session: string; //session == sidra    
    silabus: number;
    date: Date;
    tags ?: string[];
    //the data of the dapit
    //professoinal
    identfication: typeof dapitPerformanceSchema;
    payload: typeof dapitPerformanceSchema;
    decryption: typeof dapitPerformanceSchema;
    workingMethod: typeof dapitPerformanceSchema;
    understandingTheAir: typeof dapitPerformanceSchema;
    flight: typeof dapitPerformanceSchema;
    theoretical: typeof dapitPerformanceSchema;
    thinkingInAir: typeof dapitPerformanceSchema;
    safety: typeof dapitPerformanceSchema;
    briefing: typeof dapitPerformanceSchema;
    debriefing: typeof dapitPerformanceSchema;
    debriefingInAir: typeof dapitPerformanceSchema;
    implementationExecise: typeof dapitPerformanceSchema;
    dealingWithFailures: typeof dapitPerformanceSchema;
    dealingWithStress: typeof dapitPerformanceSchema;
    makingDecisions: typeof dapitPerformanceSchema;
    pilotNature: typeof dapitPerformanceSchema;
    crewMember: typeof dapitPerformanceSchema;
    //advatage and disavantage
    advantage: string[];
    disavantage: string[];
    //final Dapit
    changeTobeCommender: number;
    finalGrade: number;
    summerize: string;
}

const dapitSchema = new mongoose.Schema<IDapit>({
    nameInstractor: {
        type: String,
        required: true,
    },
    namePersonalInstractor: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
    },
    nameTrainer: {
        type: String,
        required: true,
    },
    group: {type: String,required: true,},
    idPersonalInstractor: {type: String,required: true,},
    idInstractor: {type: String,required: true,},
    idTrainer: {type: String,required: true,},
    session: {type: String,},
    silabus: {type: Number,required: true,},
    date: {type: Date,required: true,},
    identfication: [{ value: Number, description: String }],
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
    advantage: {
        type: [String],
    },
    disavantage: {
        type: [String],
    },
    changeTobeCommender: {
        type: Number,
        min: 4,
        max: 10,
    },
    finalGrade: {
        type: Number,
        min: 4,
        max: 10,
        required: true,
    },
    summerize: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IDapit>("Dapit", dapitSchema);

