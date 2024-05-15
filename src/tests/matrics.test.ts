import initApp from "../app";
import mongoose from "mongoose";
import request from "supertest";
import { Express } from "express";
import User from "../models/user_model";
import Dapit from "../models/dapit_model";
import { after } from "node:test";
import {log, error, debug} from "console";
import { Session } from "inspector";
let app: Express;

beforeAll(async () => {
    app = await initApp();
    // await Dapit.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});


const dapitPerformanceSchema = new mongoose.Schema({
    value: Number,
    description: String,
});

interface IDapit {
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
let dapit = {
    _id: undefined,
    nameInstractor: "Jonh Doe",
    namePersonalInstractor: "Kaplan",
    nameTrainer: "Moshiko",
    group: "A",
    idPersonalInstractor: "123456789",
    idInstractor: "123456789",
    idTrainer: "123456789",
    session: "A",
    silabus: 1,
    date: new Date("2022-01-01"), // Replace with the desired date
    tags : ["tag1", "tag2"],
    identfication: {value: 4, description: "good"},
    payload: {value: 5, description: "good"},
    decryption: {value: 6, description: "good"},
    workingMethod: {value: 7, description: "good"},
    understandingTheAir: {value: 8, description: "good"},
    flight: {value: 9, description: "good"},
    theoretical: {value: 10, description: "good"},
    thinkingInAir: {value: 4, description: "good"},
    safety: {value: 5, description: "good"},
    briefing: {value: 6, description: "good"},
    debriefing: {value: 7, description: "good"},
    debriefingInAir: {value: 8, description: "good"},
    implementationExecise: {value: 9, description: "good"},
    dealingWithFailures: {value: 10, description: "good"},
    dealingWithStress: {value: 4, description: "good"},
    makingDecisions: {value: 5, description: "good"},
    pilotNature: {value: 6, description: "good"},
    crewMember: {value: 7, description: "good"},
    advantage: ["advantage1", "advantage2"],
    disavantage: ["disavantage1", "disavantage2"],
    changeTobeCommender: 9,
    finalGrade: 8,
    summerize: "good",
};

let firstDapitId: string;

describe('matrics tests', () => {
    // for (let g = 0; g< 3; g++) {
        // dapit.group = String.fromCharCode(65 + g);   
        // for (let name = 0; name <4 ; name++) {
        //     dapit.nameTrainer = "trainer" + name;
        //     for (let s = 0 ; s < 5; s++) {
        //         delete dapit.session;
        //         dapit.session = "session" + s;
        //         for (let i = 0; i < 5; i++) {
        //             test ("add dapiot for trainer 1, group A, session 1, silabos 1-5", async () => {
        //                 dapit.silabus = i;
        //                 dapit.identfication.value = i+5;
        //                 dapit.payload.value = i+5;
        //                 dapit.decryption.value = i+5;
        //                 dapit.workingMethod.value = i+5;
        //                 dapit.understandingTheAir.value = i+5;
        //                 dapit.flight.value = i+5;
        //                 dapit.theoretical.value = i+5;
        //                 dapit.thinkingInAir.value = i+5;
        //                 dapit.safety.value = i+5;
        //                 dapit.briefing.value = i+5;
        //                 dapit.debriefing.value = i+5;
        //                 dapit.debriefingInAir.value = i+5;
        //                 dapit.implementationExecise.value = i+5;
        //                 dapit.dealingWithFailures.value = i+5;
        //                 dapit.dealingWithStress.value = i+5;
        //                 dapit.makingDecisions.value = i+5;
        //                 dapit.pilotNature.value = i+5;
        //                 dapit.crewMember.value = i+5;
        //                 dapit.finalGrade = i+5;
        //                 dapit.changeTobeCommender = i+5;
        //                 const res = await request(app)
        //                     .post('/dapit')
        //                     .send(dapit);
        //                 expect(res.statusCode).toBe(200);
        //             });
        //         }
        //     }
        // }
    // }

    // for (let i = 0; i < 10; i++) {
    //     const newDapit = { ...dapit }; // Create a new object based on dapit for each iteration
    //     newDapit.session = "session" + i;
    //     for (let j = 0; j < 2; j++) {
    //         const newNewDapit = { ...newDapit }; // Create a new object based on newDapit for each iteration
    //         newNewDapit.silabus = j;
    //          test("add dapiot 20 - 10 sidra, 2 sil in every sidra all the data is the same..", async () => {
    //             const res = await request(app)
    //                 .post('/dapit')
    //                 .send(newNewDapit);
    //             expect(res.statusCode).toBe(200);
    //         });
    //     }
    // }
    

    test ("get all dapit", async () => {
        const res = await request(app)
            .get('/dapit');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(20);
        // debug(res.body);
    });

    //test MegamaGrades
    test ("get MegamaGrades", async () => {
        const res = await request(app)
            .get('/matrics/getMegamGradesAvg')
            .query({group: "A"});
        // debug("res.body to get Megama:", res.body);
        // debug(res.body);
        expect(res.statusCode).toBe(200);
        const session1Average = res.body.groupAverages['session1'];
        expect(session1Average).toBe(6.5);
        expect(res.body.hanichAvgPerSession['session1']['Moshiko']).toBe(7);
    });

    test ("test getAveragePerformance", async () => {
        const res = await request(app)
            .get('/matrics/getAveragePerformance')
            .query({group: "A"});
        expect(res.statusCode).toBe(200);
        debug(res.body);
        expect(res.body.ResavgPerformance['Moshiko']['session1']['identfication']).toBe(4);
        expect(res.body.avgHanichPerPreformance['Moshiko']['identfication']).toBe(4);

    });
});