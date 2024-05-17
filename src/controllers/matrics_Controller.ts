import dapit_model, {IDapit} from "../models/dapit_model";
import { Request, Response } from 'express';
import { Query, FilterQuery } from 'mongoose';
import { BaseController } from "./base_controller";
import exp from "node:constants";
import getByFilterBasicInfo from "./dapit_Controller";
import { Console } from "node:console";
import { escapeRegExp, professionalFields, finalFields } from "../common/utils";
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

class matrics_Controller extends BaseController<IDapit> {
    constructor() {
        super(dapit_model);
    }
    // all fields.
    async getAveragePerformance(req: Request, res: Response) {
        try {
            const avgPerformance: { [trainer: string]: { [session: string]: { [field: string]: number } } } = {};
            const avgHanichPerformance: { [session: string]: { [field: string]: number } } = {};
            const avgPerformanceLength: { [trainer: string]: { [session: string]: { [field: string]: number } } } = {};
            const avgHanichPerformanceLength:  { [session: string]: { [field: string]: number } } = {};
            if (!req.query.group) res.status(400).json({ error: 'Group is required' });
            const escapedGroup = escapeRegExp(req.query.group as string);
            let filter: FilterQuery<IDapit> = {};
            filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
            const dapits: IDapit[] = await this.model.find(filter);

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
                finalFields.forEach(field => {
                    console.log("finalFields.forEach(field)")
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
                professionalFields.forEach(field => {
                    console.log("professionalFields.forEach(field)")
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
            const ResavgPerformance: { [trainer: string]: { [session: string]: { [field: string]: number } } } = avgPerformance;
            for (const trainer in ResavgPerformance) {
                for (const session in ResavgPerformance[trainer]) {
                    for (const field in ResavgPerformance[trainer][session]) {
                        ResavgPerformance[trainer][session][field] /= avgPerformanceLength[trainer][session][field];
                    }
                }
            }
            const avgHanichPerPreformance: { [trainer: string]:{[field: string]: number }} = {};
            const avgHanichPerformanceLen: { [session: string]: { [field: string]: number } } = {};
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
        } catch (error) {
            console.error('Error calculating average performance:', error);
            res.status(500);
        }
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
            res.status(500);
        }
    }
}

export default new matrics_Controller;