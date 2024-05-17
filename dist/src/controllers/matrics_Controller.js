"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dapit_model_1 = __importDefault(require("../models/dapit_model"));
const base_controller_1 = require("./base_controller");
const utils_1 = require("../common/utils");
//TODO: add final grades in pianoo and in the Megama Grades
// function escapeRegExp(string) {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }
// const professionalFields = [
//     'identfication', 'payload', 'decryption', 'workingMethod',
//     'understandingTheAir', 'flight', 'theoretical', 'thinkingInAir',
//     'safety', 'briefing', 'debriefing', 'debriefingInAir',
//     'implementationExecise', 'dealingWithFailures', 'dealingWithStress',
//     'makingDecisions', 'pilotNature', 'crewMember'
// ];
// const finalFields = [
//     'finalGrade', 'summerize'
// ];
class matrics_Controller extends base_controller_1.BaseController {
    constructor() {
        super(dapit_model_1.default);
    }
    // all fields.
    getAveragePerformance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avgPerformance = {};
                const avgHanichPerformance = {};
                const avgPerformanceLength = {};
                const avgHanichPerformanceLength = {};
                if (!req.query.group)
                    res.status(400).json({ error: 'Group is required' });
                const escapedGroup = (0, utils_1.escapeRegExp)(req.query.group);
                let filter = {};
                filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
                const dapits = yield this.model.find(filter);
                dapits.forEach(dapit => {
                    const trainer = dapit.nameTrainer;
                    const session = dapit.session;
                    if (!avgPerformance.hasOwnProperty(trainer)) {
                        console.log("if 'avgPerformance.hasOwnProperty(trainer)'");
                        avgPerformance[trainer] = {};
                        avgPerformanceLength[trainer] = {};
                    }
                    if (!avgPerformance[trainer].hasOwnProperty(session)) {
                        console.log("if 'avgPerformance[trainer].hasOwnProperty(session)'");
                        avgPerformance[trainer][session] = {};
                        avgPerformanceLength[trainer][session] = {};
                    }
                    if (!avgHanichPerformance.hasOwnProperty(session)) {
                        console.log("if 'avgHanichPerformance.hasOwnProperty(session)'");
                        avgHanichPerformance[session] = {};
                        avgHanichPerformanceLength[session] = {};
                    }
                    utils_1.finalFields.forEach(field => {
                        console.log("finalFields.forEach(field)");
                        if (dapit[field] !== undefined && typeof dapit[field] === 'number') {
                            if (!avgPerformance[trainer][session].hasOwnProperty(field)) {
                                console.log("if 'avgPerformance[trainer][session].hasOwnProperty(field)'");
                                avgPerformance[trainer][session][field] = 0;
                                avgPerformanceLength[trainer][session][field] = 0;
                            }
                            if (!avgHanichPerformance[session].hasOwnProperty(field)) {
                                console.log("if 'avgHanichPerformance[session].hasOwnProperty(field)'");
                                avgHanichPerformance[session][field] = 0;
                                avgHanichPerformanceLength[session][field] = 0;
                            }
                            console.log('dapit[field].value:', dapit[field]);
                            console.log('before avgPerformance[trainer][session][field]:', avgPerformance[trainer][session][field]);
                            avgPerformance[trainer][session][field] += dapit[field];
                            avgHanichPerformance[session][field] += dapit[field];
                            avgPerformanceLength[trainer][session][field]++;
                            avgHanichPerformanceLength[session][field]++;
                            console.log('after avgPerformance[trainer][session][field]:', avgPerformance[trainer][session][field]);
                        }
                    });
                    utils_1.professionalFields.forEach(field => {
                        console.log("professionalFields.forEach(field)");
                        if (dapit[field] && dapit[field][0] && typeof dapit[field][0].value === 'number') {
                            if (!avgPerformance[trainer][session].hasOwnProperty(field)) {
                                console.log("if 'avgPerformance[trainer][session].hasOwnProperty(field)'");
                                avgPerformance[trainer][session][field] = 0;
                                avgPerformanceLength[trainer][session][field] = 0;
                            }
                            if (!avgHanichPerformance[session].hasOwnProperty(field)) {
                                console.log("if 'avgHanichPerformance[session].hasOwnProperty(field)'");
                                avgHanichPerformance[session][field] = 0;
                                avgHanichPerformanceLength[session][field] = 0;
                            }
                            console.log('dapit[field].value:', dapit[field][0].value);
                            console.log('before avgPerformance[trainer][session][field]:', avgPerformance[trainer][session][field]);
                            avgPerformance[trainer][session][field] += dapit[field][0].value;
                            avgHanichPerformance[session][field] += dapit[field][0].value;
                            avgPerformanceLength[trainer][session][field]++;
                            avgHanichPerformanceLength[session][field]++;
                            console.log('after avgPerformance[trainer][session][field]:', avgPerformance[trainer][session][field]);
                        }
                    });
                });
                console.log('avgPerformance:', avgPerformance);
                console.log('avgHanichPerformance:', avgHanichPerformance);
                const ResavgPerformance = avgPerformance;
                for (const trainer in ResavgPerformance) {
                    for (const session in ResavgPerformance[trainer]) {
                        for (const field in ResavgPerformance[trainer][session]) {
                            ResavgPerformance[trainer][session][field] /= avgPerformanceLength[trainer][session][field];
                        }
                    }
                }
                const avgHanichPerPreformance = {};
                const avgHanichPerformanceLen = {};
                for (const trainer in avgPerformance) {
                    avgHanichPerPreformance[trainer] = {};
                    avgHanichPerformanceLen[trainer] = {};
                    for (const session in avgPerformance[trainer]) {
                        for (const field in avgPerformance[trainer][session]) {
                            if (!avgHanichPerPreformance[trainer].hasOwnProperty(field)) {
                                avgHanichPerPreformance[trainer][field] = 0;
                                avgHanichPerformanceLen[trainer][field] = 0;
                            }
                            avgHanichPerPreformance[trainer][field] += avgPerformance[trainer][session][field];
                            avgHanichPerformanceLen[trainer][field]++;
                        }
                    }
                }
                for (const trainer in avgHanichPerPreformance) {
                    for (const field in avgHanichPerPreformance[trainer]) {
                        avgHanichPerPreformance[trainer][field] /= avgHanichPerformanceLen[trainer][field];
                    }
                }
                console.log('avgHanichPerPreformance:', avgHanichPerPreformance);
                for (const session in avgHanichPerformance) {
                    for (const field in avgHanichPerformance[session]) {
                        avgHanichPerformance[session][field] /= avgHanichPerformanceLength[session][field];
                    }
                }
                console.log('ResavgPerformance:', JSON.stringify(ResavgPerformance, null, 2));
                res.status(200).json({ ResavgPerformance, avgHanichPerPreformance });
            }
            catch (error) {
                console.error('Error calculating average performance:', error);
                res.status(500);
            }
        });
    }
    //TODO: calc by precents!
    getMegamGradesAvg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getMegamGradesAvg in matrics_Controller.ts');
            try {
                const groupAverages = {};
                const groupAvgLength = {};
                const hanichAvgPerSession = {};
                const hanichAvgPerSessionLength = {};
                const sessionAvgPerHanich = {};
                const sessionAvgPerHanichLength = {};
                // Group by group and professional category and calculate averages
                if (!req.query.group)
                    res.status(400).json({ error: 'Group is required' });
                const escapedGroup = (0, utils_1.escapeRegExp)(req.query.group);
                let filter = {};
                filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
                const dapits = yield this.model.find(filter);
                // console.log('dapits:', dapits);
                dapits.forEach(dapit => {
                    if (!groupAverages[dapit.session]) {
                        groupAverages[dapit.session] = 0;
                        groupAvgLength[dapit.session] = 0;
                        hanichAvgPerSession[dapit.session] = {};
                        hanichAvgPerSessionLength[dapit.session] = {};
                    }
                    if (!sessionAvgPerHanich[dapit.nameTrainer]) {
                        sessionAvgPerHanich[dapit.nameTrainer] = {};
                        sessionAvgPerHanichLength[dapit.nameTrainer] = {};
                    }
                    if (!hanichAvgPerSession[dapit.session].hasOwnProperty(dapit.nameTrainer)) {
                        hanichAvgPerSession[dapit.session][dapit.nameTrainer] = 0;
                        hanichAvgPerSessionLength[dapit.session][dapit.nameTrainer] = 0;
                    }
                    if (!sessionAvgPerHanich[dapit.nameTrainer].hasOwnProperty(dapit.session)) {
                        sessionAvgPerHanich[dapit.nameTrainer][dapit.session] = 0;
                        sessionAvgPerHanichLength[dapit.nameTrainer][dapit.session] = 0;
                    }
                    sessionAvgPerHanich[dapit.nameTrainer][dapit.session] += dapit.finalGrade;
                    sessionAvgPerHanichLength[dapit.nameTrainer][dapit.session]++;
                    groupAverages[dapit.session] += dapit.finalGrade;
                    groupAvgLength[dapit.session]++;
                    hanichAvgPerSession[dapit.session][dapit.nameTrainer] += dapit.finalGrade;
                    hanichAvgPerSessionLength[dapit.session][dapit.nameTrainer]++;
                });
                for (const session in groupAverages) {
                    groupAverages[session] /= Number(groupAvgLength[session]);
                    for (const trainer in hanichAvgPerSession[session]) {
                        hanichAvgPerSession[session][trainer] /= Number(hanichAvgPerSessionLength[session][trainer]);
                    }
                }
                for (const trainer in sessionAvgPerHanich) {
                    for (const session in sessionAvgPerHanich[trainer]) {
                        sessionAvgPerHanich[trainer][session] /= Number(sessionAvgPerHanichLength[trainer][session]);
                    }
                }
                res.status(200).json({ groupAverages, hanichAvgPerSession, sessionAvgPerHanich, dapits });
            }
            catch (error) {
                console.error('Error calculating group averages:', error);
                res.status(500);
            }
        });
    }
}
exports.default = new matrics_Controller;
//# sourceMappingURL=matrics_Controller.js.map