import mongoose from "mongoose";

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
    //the data of the dapit
    //professoinal
    identfication: [number, string];
    payload: [number, string];
    decryption: [number, string];
    workingMethod: [number, string];
    understandingTheAir: [number, string];
    flight: [number, string];
    theortical: [number, string];
    thinkingInAir: [number, string];
    safety: [number, string];
    //ground preformance
    briefing: [number, string];
    debriefing: [number, string];
    debriefingInAir: [number, string];
    implementationExecise: [number, string];
    //personal preformance
    dealingWithFailures: [number, string];
    dealingWithStress: [number, string];
    makingDecisions: [number, string];
    pilotNautre: [number, string];
    crewMember: [number, string];
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
    nameTrainer: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
    idPersonalInstractor: {
        type: String,
        required: true,
    },
    idInstractor: {
        type: String,
        required: true,
    },
    idTrainer: {
        type: String,
        required: true,
    },
    session: {
        type: String,
    },
    silabus: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    identfication: {
        type: [Number, String],
    },
    payload: {
        type: [Number, String],
    },
    decryption: {
        type: [Number, String],
    },
    workingMethod: {
        type: [Number, String],
    },
    understandingTheAir: {
        type: [Number, String],
    },
    flight: {
        type: [Number, String],
    },
    theortical: {
        type: [Number, String],
    },
    thinkingInAir: {
        type: [Number, String],
    },
    safety: {
        type: [Number, String],
    },
    briefing: {
        type: [Number, String],
    },
    debriefing: {
        type: [Number, String],
    },
    debriefingInAir: {
        type: [Number, String],
    },
    implementationExecise: {
        type: [Number, String],
    },
    dealingWithFailures: {
        type: [Number, String],
    },
    dealingWithStress: {
        type: [Number, String],
    },
    makingDecisions: {
        type: [Number, String],
    },
    pilotNautre: {
        type: [Number, String],
    },
    crewMember: {
        type: [Number, String],
    },
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

