import dapit_model, {IDapit} from "../models/dapit_model";
import { Request, Response } from 'express';
import { Query, FilterQuery } from 'mongoose';
import { BaseController } from "./base_controller";
import exp from "node:constants";
import getByFilterBasicInfo from "./dapit_Controller";
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

class matrics_Controller extends BaseController<IDapit> {
    constructor() {
        super(dapit_model);
    }
  //TODO: calc by precents!
    async getMegamGradesAvg(req: Request, res: Response) {
        console.log('getMegamGradesAvg in matrics_Controller.ts');
        try {
            const groupAverages: { [session: string]: number } = {};
            const groupAvgLength: { [session: string]: number } = {};
            const hanichAvgPerSession: { [session: string]: { [trainer: string]: number } } = {}; 
            const hanichAvgPerSessionLength: { [session: string]: { [trainer: string]: number } } = {};
            const sessionAvgPerHanich: { [trainer: string]: { [session: string]: number } } = {};
            const sessionAvgPerHanichLength: { [trainer: string]: { [session: string]: number } } = {};
            // Group by group and professional category and calculate averages
            if (!req.query.group) res.status(400).json({ error: 'Group is required' });
            const escapedGroup = escapeRegExp(req.query.group as string);
            let filter: FilterQuery<IDapit> = {};
            filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
            const dapits: IDapit[] = await this.model.find(filter);
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
            res.status(200).json({ groupAverages,hanichAvgPerSession,sessionAvgPerHanich, dapits});
        } catch (error) {
            console.error('Error calculating group averages:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new matrics_Controller;