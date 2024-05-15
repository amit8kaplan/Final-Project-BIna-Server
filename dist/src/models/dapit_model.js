"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dapitPerformanceSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.dapitPerformanceSchema = new mongoose_1.default.Schema({
    value: Number,
    description: String,
});
const dapitSchema = new mongoose_1.default.Schema({
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
    group: { type: String, required: true, },
    idPersonalInstractor: { type: String, required: true, },
    idInstractor: { type: String, required: true, },
    idTrainer: { type: String, required: true, },
    session: { type: String, },
    silabus: { type: Number, required: true, },
    date: { type: Date, required: true, },
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
exports.default = mongoose_1.default.model("Dapit", dapitSchema);
//# sourceMappingURL=dapit_model.js.map