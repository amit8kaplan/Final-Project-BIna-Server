import initApp from "../app";
import mongoose from "mongoose";
import request from "supertest";
import { Express } from "express";
import User from "../models/user_model";
import Dapit from "../models/dapit_model";
import { after } from "node:test";
import {log, error, debug} from "console";
let app: Express;

beforeAll(async () => {
    debug("beforeAll");
    app = await initApp();
    await Dapit.deleteMany();
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
const dapit = {
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

describe("Dapit tests", () => {
    test ("Test Get All Dapit - empty response", async () => {
        debug("Test Get All Dapit - empty response")
        const response = await request(app)
            .get("/dapit");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
    
    test("Add dapit", async () => {
        debug("test Add dapit")
        const response = await request(app).post("/dapit")
            .send(dapit);
        expect(response.statusCode).toBe(200);
        expect(response.body.nameInstractor).toBe(dapit.nameInstractor);
        expect(response.body.namePersonalInstractor).toBe(dapit.namePersonalInstractor);
    });

    test ("get all dapit", async () => {
        debug("get all dapit")
        const response = await request(app)
            .get("/dapit");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test ("Test Get the specific dapit using nameInstractor", async () => {
        debug("Test Get the specific dapit using nameInstractor")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ nameInstractor: dapit.nameInstractor });
        debug ("response.body: ", response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.nameInstractor).toBe(dapit.nameInstractor);
    });



    test ("Test Get the specific dapit using namePersonalInstractor", async () => {
        debug("Test Get the specific dapit using namePersonalInstractor")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ namePersonalInstractor: dapit.namePersonalInstractor });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.namePersonalInstractor).toBe(dapit.namePersonalInstractor);
    });

    test ("Test Get the specific dapit using nameTrainer", async () => {
        debug("Test Get the specific dapit using nameTrainer")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ nameTrainer: dapit.nameTrainer });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.nameTrainer).toBe(dapit.nameTrainer);
    });

    test ("Test Get the specific dapit using group", async () => {
        debug("Test Get the specific dapit using group")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ group: dapit.group });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.group).toBe(dapit.group);
    });
    test ("Test Get the dapit with a megama thet doesnt exist", async () => {
        debug("Test Get the dapit with a megama thet doesnt exist")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ group: "B" });
        expect(response.statusCode).toBe(200);
        console.log("response.body.length: ", response.body.length);
        console.log("response.body: ", response.body);
        expect(response.body.length).toBe(0);
    });

    test ("Test Get the specific dapit using crewMember Grade", async () => {
        debug("Test Get the specific dapit using crewMember Grade")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberVal: 7 });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        // debug("response.body: ", response.body);
        const st = response.body[0];
        // debug("st.crewMember.value: ", st.crewMember);
        expect(st.crewMember[0].value).toBe(7);
    });

    test ("Test get the specific dapit using crewMember description", async () => {
        debug("Test get the specific dapit using crewMember description")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberDescription: "good" });
        debug("response.body: ", response.body);
        debug("response.body.length: ", response.body.length);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        debug("st.crewMember: ", st.crewMember);
        debug("st.crewMember[1]: ", st.crewMember[1]);
        expect(st.crewMember[0].description).toBe("good");
    });

    test ("Test get the specific dapit using crewMember description regex", async () => {
        debug("Test get the specific dapit using crewMember description regex")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberDescription: "go" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.crewMember[0].description).toBe("good");
    });

    test ("test get the spesific dapit by advantage1", async () => {
        debug("test get the spesific dapit by advantage")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ advantage: "advantage1" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.advantage[0]).toBe("advantage1");
    });

    test ("test get the spesific dapit by advantage2", async () => {
        debug("test get the spesific dapit by advantage2")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ advantage: "advantage2" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.advantage[1]).toBe("advantage2");
    });

    test ("test get empty response by advantage", async () => {
        debug("test get empty response by advantage")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ advantage: "advantage3" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test ("test get the spesific dapit by summerize", async () => {
        debug("test get the spesific dapit by summerize")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ summerize: "good" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.summerize).toBe("good");
    });
    test ("test get the spesific dapit by summerize regex", async () => {
        debug("test get the spesific dapit by summerize regex")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ summerize: "go" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.summerize).toBe("good");
    });
    test ("test get empty response by summerize", async () => {
        debug("test get empty response by summerize")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ summerize: "bad" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test ("test get by silabus", async () => {
        debug("test get by silabus")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ silabus: 1 });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.silabus).toBe(1);
    });

    test("test get by spesifc date", async () => {
        debug("test get by spesifc date")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ date: "2022-01-01" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.date).toBe("2022-01-01T00:00:00.000Z");
    });
    test ("test get empty response by date", async () => {
        debug("test get empty response by date")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ date: "2022-01-02" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }
    );
    test ("test gets by start and end dates", async () => {
        debug("test gets by start and end dates")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ startDate: "2020-01-01", endDate: "2022-01-02" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.date).toBe("2022-01-01T00:00:00.000Z");
    });
});

