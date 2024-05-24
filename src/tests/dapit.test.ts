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
    identification: typeof dapitPerformanceSchema;
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
    identification: {value: 4, description: "good"},
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
        firstDapitId = response.body._id;
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
        debug("response.body: ", response.body);
        const st = response.body[0];
        debug("st.crewMember.value: ", st.crewMember);
        expect(st.crewMember[0].value).toBe(7);
    });

    test ("Test get the specific dapit using crewMember description", async () => {
        debug("Test get the specific dapit using crewMember description")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberDescription: "good" });
        // debug("response.body: ", response.body);
        // debug("response.body.length: ", response.body.length);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        // debug("st.crewMember: ", st.crewMember);
        // debug("st.crewMember[1]: ", st.crewMember[1]);
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

    test ("test get the spesfic dapit by part of sting in the advange", async () => {
        debug("test get the spesfic dapit by part of sting in the advange")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ advantage: "adv" });
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
    //add 10 dapit's with not the same data inside
    for (let i = 0; i < 10; i++) {
        test("Add dapit", async () => {
            dapit.tags = ["tag" + i];
            dapit.tags.push("tag" + (i + 1));
            delete dapit.identification
            if (i == 8) {
                delete dapit.safety
            }
            const response = await request(app).post("/dapit")
                .send(dapit);
            expect(response.statusCode).toBe(200);
            expect(response.body.nameInstractor).toBe(dapit.nameInstractor);
            expect(response.body.namePersonalInstractor).toBe(dapit.namePersonalInstractor);
        });
    }

    test ("gets all the dapit", async () => {
        debug("gets all the dapit")
        const response = await request(app)
            .get("/dapit");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(11);
    });
    /// test to getByTagsORLogic
    test ("test get the spesific dapit by tags -Or Logic", async () => {
        debug("test get the spesific dapit by tags")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ tags: "tag1" , tagsLogic: "or"});
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(3);    
        // debug("response.body: ", response.body);
    });

    test ("test get the spesific dapit by tags - And Logic", async () => {
        debug("test get the spesific dapit by tags And Logic")
        const response = await request(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ tags: ["tag1", "tag2"] , tagsLogic: "and"});
        // debug("response.body: ", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);    
    });

    //get By filter Or Logic
    test ("test get the dapits by who add write in is dapit a grade to identifcation", async () => {
        debug("test get the dapits by who add write in is dapit a grade to identifcation")
        const response = await request(app)
            .get("/dapit/getByFilter")
            .query({ has_identification: 1 , logic : "or"});
        // debug("response.body: ", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        // debug("response.body: ", response.body);
    });

    test ("test get the dapits by who add write in is dapit a grade in safety", async () => {
        debug("test get the dapits by who add write in is dapit a grade in safety")
        const response = await request(app)
            .get("/dapit/getByFilter")
            .query({ has_safety: 1 , logic : "or"});
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(9);
        // debug("response.body: ", response.body);
    });
    test("test get the dapits by who add write in is dapit a grade in safety and identification", async () => {
        debug("test get the dapits by who add write in is dapit a grade in safety and identification")
        const response = await request(app)
            .get("/dapit/getByFilter")
            .query({ has_safety: 1, has_identification: 1 , logic: "and"});
        // debug("response.body: ", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        // debug("response.body: ", response.body);
    });

    test("test get the dapits by who add write in is dapit a grade in safety or identification", async () => {
        debug("test get the dapits by who add write in is dapit a grade in safety and identification")
        const response = await request(app)
            .get("/dapit/getByFilter")
            .query({ has_safety: 1, has_identification: 1 , logic: "or"});
        debug("response.body: ", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(9);
        // debug("response.body: ", response.body);
    });

    for (let i = 0; i < 10; i++) {
        test("Add dapit", async () => {
            const newDapit = { ...dapit, nameInstractor: "ron", silabus: i + 1, date: new Date("2024-9-" + (20 -i))};
            const response = await request(app).post("/dapit")
                .send(newDapit);
            expect(response.statusCode).toBe(200);
            expect(response.body.nameInstractor).toBe(newDapit.nameInstractor);
            expect(response.body.namePersonalInstractor).toBe(newDapit.namePersonalInstractor);
        });
    }
    test ("csv file", async () => {
        debug("csv file")
        const response = await request(app)
            .get(`/dapit/getCSVfile/${dapit.idTrainer}`);
        expect(response.statusCode).toBe(200);
    });
    test ("csv file for all data", async () => {
        debug("csv file for all data")
        const response = await request(app)
            .get("/dapit/getCSVfile");
        expect(response.statusCode).toBe(200);
    });

    test ("get the document by filter", async () => {
        debug("get the document by filter")
        const response = await request(app)
            .get("/dapit/getDocumentbyFilter")
            .query({ nameInstractor: "Jonh Doe" });
        expect(response.statusCode).toBe(200);
    });
    test("get all dapit to documents without filter", async () => {
        debug("get all dapit by filter")
        const response = await request(app)
            .get("/dapit/getDocumentbyFilter")
        expect(response.statusCode).toBe(200);
    });
    test ("get doucment ron + session A silbus 1", async () => {
        debug("get doucment ron + session A silbus 1")
        const response = await request(app)
            .get("/dapit/getDocumentbyFilter")
            .query({ nameInstractor: "ron", session: "A", silabus: 1 });
        expect(response.statusCode).toBe(200);
    });
    test ("test put the first dapit", async () => {
        debug("test put the first dapit")
        const response = await request(app)
            .put(`/dapit/${firstDapitId}`)
            .send({ nameInstractor: "Jonh Doe22" });
        // debug("response.body: ", response.body);
        debug("the id of the first dapit: ", firstDapitId)
        debug("the id of the first dapit after the put: ", response.body._id)
        expect(response.statusCode).toBe(200);
        expect(response.body.nameInstractor).toBe("Jonh Doe22");
    });
    test ("test delete the first dapit", async () => {
        debug("test delete the first dapit")
        const response = await request(app)
            .delete(`/dapit/${firstDapitId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.deletedId).toBe(firstDapitId);
    });



});
