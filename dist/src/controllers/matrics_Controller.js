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
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
const professionalFields = [
    'identfication', 'payload', 'decryption', 'workingMethod',
    'understandingTheAir', 'flight', 'theoretical', 'thinkingInAir',
    'safety', 'briefing', 'debriefing', 'debriefingInAir',
    'implementationExecise', 'dealingWithFailures', 'dealingWithStress',
    'makingDecisions', 'pilotNature', 'crewMember'
];
const finalFields = [
    'finalGrade', 'summerize'
];
class matrics_Controller extends base_controller_1.BaseController {
    constructor() {
        super(dapit_model_1.default);
    }
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
                const escapedGroup = escapeRegExp(req.query.group);
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
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new matrics_Controller;
//# sourceMappingURL=matrics_Controller.js.map