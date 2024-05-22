import init from '../app';
import mongoose from "mongoose";
import request from "supertest";
import { Express } from "express";
import User from "../models/user_model";
import Dapit  from "../models/dapit_model";
import Wall from '../models/wall_model';
import Post from '../models/post_model';
import Response from '../models/response_model';
import Trainer from '../models/trainer_model';

import { after } from "node:test";
import {log, error, debug} from "console";
import { Session } from "inspector";
import { title } from 'process';
let app: Express;

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
const dapit = {
    nameInstractor: "Cfir",
    namePersonalInstractor: "Man",
    nameTrainer: "Amit",
    group: "A",
    idPersonalInstractor: "1234567890",
    idInstractor: "1234567890",
    idTrainer: "1Amit",
    session: "A",
    silabus: 1,
    date: new Date("2021-10-10"),
    tags: ["tag1", "tag2"],
    identfication: {value: 4, description: "description"},
    payload: {value: 4, description: "description"},
    decryption: {value: 4, description: "description"},
    workingMethod: {value: 4, description: "description"},
    understandingTheAir: {value: 4, description: "description"},
    flight: {value: 4, description: "description"},
    theoretical: {value: 4, description: "description"},
    thinkingInAir: {value: 4, description: "description"},
    safety: {value: 4, description: "description"},
    briefing: {value: 4, description: "description"},
    debriefing: {value: 4, description: "description"},
    debriefingInAir: {value: 4, description: "description"},
    implementationExecise: {value: 4, description: "description"},
    dealingWithFailures: {value: 4, description: "description"},
    dealingWithStress: {value: 4, description: "description"},
    makingDecisions: {value: 4, description: "description"},
    pilotNature: {value: 4, description: "description"},
    crewMember: {value: 4, description: "description"},
    advantage: ["advantage1", "advantage2"],
    disavantage: ["disavantage1", "disavantage2"],
    changeTobeCommender: 9,
    finalGrade: 8,
    summerize: "good",
};

 interface IPost{
    idTrainer: mongoose.Schema.Types.ObjectId;
    idInstractor: mongoose.Schema.Types.ObjectId;
    nameInstractor: string;
    title?: string;
    content: string;
    date: Date;
    _id?: string;
}
const post = {
    idTrainer: "1Amit",
    idInstractor: "1234567890",
    nameInstractor: "Cfir",
    title: "title",
    content: "content",
    date: new Date("2021-10-10"),
};
interface IResponse{
    idPost?: mongoose.Schema.Types.ObjectId;
    idDapit?: mongoose.Schema.Types.ObjectId;
    idResponse?: mongoose.Schema.Types.ObjectId;
    idTrainer: mongoose.Schema.Types.ObjectId;
    idInstuctor: mongoose.Schema.Types.ObjectId;
    nameInstractor: string;
    nameTrainer: string;
    content: string;
    _id?: string;
    date: Date;
}
const response = {
    idPost: "1Amit",
    idDapit: "1234567890",
    idResponse: "1234567890",
    idTrainer: "1Amit",
    idInstuctor: "1234567890",
    nameInstractor: "Cfir",
    nameTrainer: "Amit",
    content: "content",
    date: new Date("2021-10-10"),
};

beforeAll(async () => {
    app = await init();
    await User.deleteMany();
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe("wall tests", () => {
    for (let i = 0; i < 10; i++) {
        let newDapit = {...dapit, silabus: i+1, date: new Date("2021-10-" + (i+1))}; 
        let newPost = {...post, title: "title" + i, content: "content" + i, date: new Date("2021-10-" + (i+1))};
        it("should create a new dapit", async () => {
            const resDapit = await request(app).post("/dapit").send(newDapit);
            const resPost = await request(app).post("/post").send(newPost);
            const newResponseToDapit = {...response, idDapit: resDapit.body._id , idPost: "", content: "content" + i, date: new Date("2021-11-" + (i+1))};
            const resResponse = await request(app).post("/response").send(newResponseToDapit);
            const newResponseToPost = {...response, idDapit: "", idPost: resPost.body._id, content: "content" + i, date: new Date("2021-11-" + (i+1))};
            const resResponse2 = await request(app).post("/response").send(newResponseToPost);
        });
    }
});   
