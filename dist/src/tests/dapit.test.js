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
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const dapit_model_1 = __importDefault(require("../models/dapit_model"));
const console_1 = require("console");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, console_1.debug)("beforeAll");
    app = yield (0, app_1.default)();
    yield dapit_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const dapitPerformanceSchema = new mongoose_1.default.Schema({
    value: Number,
    description: String,
});
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
    tags: ["tag1", "tag2"],
    identfication: { value: 4, description: "good" },
    payload: { value: 5, description: "good" },
    decryption: { value: 6, description: "good" },
    workingMethod: { value: 7, description: "good" },
    understandingTheAir: { value: 8, description: "good" },
    flight: { value: 9, description: "good" },
    theoretical: { value: 10, description: "good" },
    thinkingInAir: { value: 4, description: "good" },
    safety: { value: 5, description: "good" },
    briefing: { value: 6, description: "good" },
    debriefing: { value: 7, description: "good" },
    debriefingInAir: { value: 8, description: "good" },
    implementationExecise: { value: 9, description: "good" },
    dealingWithFailures: { value: 10, description: "good" },
    dealingWithStress: { value: 4, description: "good" },
    makingDecisions: { value: 5, description: "good" },
    pilotNature: { value: 6, description: "good" },
    crewMember: { value: 7, description: "good" },
    advantage: ["advantage1", "advantage2"],
    disavantage: ["disavantage1", "disavantage2"],
    changeTobeCommender: 9,
    finalGrade: 8,
    summerize: "good",
};
describe("Dapit tests", () => {
    test("Test Get All Dapit - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get All Dapit - empty response");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Add dapit", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("test Add dapit");
        const response = yield (0, supertest_1.default)(app).post("/dapit")
            .send(dapit);
        expect(response.statusCode).toBe(200);
        expect(response.body.nameInstractor).toBe(dapit.nameInstractor);
        expect(response.body.namePersonalInstractor).toBe(dapit.namePersonalInstractor);
    }));
    test("get all dapit", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("get all dapit");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Test Get the specific dapit using nameInstractor", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get the specific dapit using nameInstractor");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ nameInstractor: dapit.nameInstractor });
        (0, console_1.debug)("response.body: ", response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.nameInstractor).toBe(dapit.nameInstractor);
    }));
    test("Test Get the specific dapit using namePersonalInstractor", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get the specific dapit using namePersonalInstractor");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ namePersonalInstractor: dapit.namePersonalInstractor });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.namePersonalInstractor).toBe(dapit.namePersonalInstractor);
    }));
    test("Test Get the specific dapit using nameTrainer", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get the specific dapit using nameTrainer");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ nameTrainer: dapit.nameTrainer });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.nameTrainer).toBe(dapit.nameTrainer);
    }));
    test("Test Get the specific dapit using group", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get the specific dapit using group");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ group: dapit.group });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.group).toBe(dapit.group);
    }));
    test("Test Get the dapit with a megama thet doesnt exist", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get the dapit with a megama thet doesnt exist");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ group: "B" });
        expect(response.statusCode).toBe(200);
        console.log("response.body.length: ", response.body.length);
        console.log("response.body: ", response.body);
        expect(response.body.length).toBe(0);
    }));
    test("Test Get the specific dapit using crewMember Grade", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test Get the specific dapit using crewMember Grade");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberVal: 7 });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        // debug("response.body: ", response.body);
        const st = response.body[0];
        // debug("st.crewMember.value: ", st.crewMember);
        expect(st.crewMember[0].value).toBe(7);
    }));
    test("Test get the specific dapit using crewMember description", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test get the specific dapit using crewMember description");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberDescription: "good" });
        (0, console_1.debug)("response.body: ", response.body);
        (0, console_1.debug)("response.body.length: ", response.body.length);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        (0, console_1.debug)("st.crewMember: ", st.crewMember);
        (0, console_1.debug)("st.crewMember[1]: ", st.crewMember[1]);
        expect(st.crewMember[0].description).toBe("good");
    }));
    test("Test get the specific dapit using crewMember description regex", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.debug)("Test get the specific dapit using crewMember description regex");
        const response = yield (0, supertest_1.default)(app)
            .get("/dapit/getByFilterBasicInfo")
            .query({ crewMemberDescription: "go" });
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.crewMember[0].description).toBe("good");
    }));
});
//# sourceMappingURL=dapit.test.js.map