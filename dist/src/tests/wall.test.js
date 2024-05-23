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
const post_model_1 = __importDefault(require("../models/post_model"));
const response_model_1 = __importDefault(require("../models/response_model"));
const trainer_model_1 = __importDefault(require("../models/trainer_model"));
let app;
const validObjectId = "123"; // Generate a new valid ObjectId
const validObjectId2 = "456"; // Generate a new valid ObjectId
const dapit = {
    nameInstractor: "Cfir",
    namePersonalInstractor: "Man",
    nameTrainer: "Amit",
    group: "A",
    idPersonalInstractor: "1234567890",
    idInstractor: "12345",
    idTrainer: validObjectId,
    session: "A",
    silabus: 1,
    date: new Date("2021-10-10"),
    tags: ["tag1", "tag2"],
    identification: { value: 4, description: "description" },
    payload: { value: 4, description: "description" },
    decryption: { value: 4, description: "description" },
    workingMethod: { value: 4, description: "description" },
    understandingTheAir: { value: 4, description: "description" },
    flight: { value: 4, description: "description" },
    theoretical: { value: 4, description: "description" },
    thinkingInAir: { value: 4, description: "description" },
    safety: { value: 4, description: "description" },
    briefing: { value: 4, description: "description" },
    debriefing: { value: 4, description: "description" },
    debriefingInAir: { value: 4, description: "description" },
    implementationExecise: { value: 4, description: "description" },
    dealingWithFailures: { value: 4, description: "description" },
    dealingWithStress: { value: 4, description: "description" },
    makingDecisions: { value: 4, description: "description" },
    pilotNature: { value: 4, description: "description" },
    crewMember: { value: 4, description: "description" },
    advantage: ["advantage1", "advantage2"],
    disavantage: ["disavantage1", "disavantage2"],
    changeTobeCommender: 9,
    finalGrade: 8,
    summerize: "good",
};
const post = {
    idTrainer: validObjectId,
    idInstractor: "123",
    nameInstractor: "Cfir",
    title: "title",
    content: "content",
    date: new Date("2021-10-10"),
};
const response = {
    idPost: "",
    idDapit: "",
    idTrainer: validObjectId,
    idInstuctor: "123",
    nameInstractor: "Cfir",
    nameTrainer: "Amit",
    content: "content",
    date: new Date("2021-10-10"),
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield dapit_model_1.default.deleteMany();
    yield post_model_1.default.deleteMany();
    yield response_model_1.default.deleteMany();
    yield trainer_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let idTrainer;
describe("wall tests", () => {
    for (let i = 0; i < 10; i++) {
        let newDapit = Object.assign(Object.assign({}, dapit), { silabus: i + 1, date: new Date("2021-9-" + (20 - i)) });
        let newPost = Object.assign(Object.assign({}, post), { title: "title" + i, content: "content" + i, date: new Date("2021-10-" + (20 - i)) });
        console.log("newPost", newPost);
        test("should create a new dapit", () => __awaiter(void 0, void 0, void 0, function* () {
            const resPost = yield (0, supertest_1.default)(app).post("/wall/posts").send(newPost);
            expect(resPost.status).toBe(201);
            expect(resPost.body.title).toBe(newPost.title);
            expect(resPost.body.idTrainer).toBe(newPost.idTrainer);
            expect(resPost.body.idInstractor).toBe(newPost.idInstractor);
            expect(resPost.body.nameInstractor).toBe(newPost.nameInstractor);
            expect(resPost.body.content).toBe(newPost.content);
            expect(resPost.body.date).toBe(newPost.date.toISOString());
            const resDapit = yield (0, supertest_1.default)(app).post("/dapit").send(newDapit);
            const newResponseToDapit = Object.assign(Object.assign({}, response), { idDapit: resDapit.body._id, idPost: "", content: "content" + i, date: new Date("2021-11-" + (i + 1)) });
            idTrainer = resPost.body.idTrainer; // Correctly reference idTrainer here
            const resResponse2 = yield (0, supertest_1.default)(app).post("/wall/responses").send(newResponseToDapit);
            const newResponseToPost = Object.assign(Object.assign({}, response), { idDapit: "", idPost: resPost.body._id, content: "content" + i, date: new Date("2022-11-" + (i + 1)) });
            const resResponse3 = yield (0, supertest_1.default)(app).post("/wall/responses").send(newResponseToPost);
            expect(resResponse2.status).toBe(201);
        }));
    }
    test("should get wall by id trainer", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/wall/" + idTrainer);
        expect(res.status).toBe(200);
        //check if the first obj is with the date of 2021-10-20
        expect(res.body[0].date).toBe("2021-10-20T00:00:00.000Z");
    }));
    for (let i = 0; i < 10; i++) {
        let newDapit = Object.assign(Object.assign({}, dapit), { nameInstractor: "Cfir2", idTrainer: validObjectId2, silabus: i + 1, date: new Date("2024-9-" + (20 - i)) });
        let newPost = Object.assign(Object.assign({}, post), { title: "title" + i, content: "content" + i, date: new Date("2021-10-" + (20 - i)) });
        test("should create a new dapit", () => __awaiter(void 0, void 0, void 0, function* () {
            const resPost = yield (0, supertest_1.default)(app).post("/wall/posts").send(newPost);
            expect(resPost.status).toBe(201);
            expect(resPost.body.title).toBe(newPost.title);
            const resDapit = yield (0, supertest_1.default)(app).post("/dapit").send(newDapit);
            const newResponseToDapit = Object.assign(Object.assign({}, response), { idDapit: resDapit.body._id, idPost: "", content: "content" + i, date: new Date("2021-11-" + (i + 1)) });
            idTrainer = resPost.body.idTrainer; // Correctly reference idTrainer here
            const resResponse2 = yield (0, supertest_1.default)(app).post("/wall/responses").send(newResponseToDapit);
            const newResponseToPost = Object.assign(Object.assign({}, response), { idDapit: "", idPost: resPost.body._id, content: "content" + i, date: new Date("2022-11-" + (i + 1)) });
            const resResponse3 = yield (0, supertest_1.default)(app).post("/wall/responses").send(newResponseToPost);
            expect(resResponse2.status).toBe(201);
        }));
    }
    test("should get wall by id trainer", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/wall/" + validObjectId2);
        expect(res.status).toBe(200);
        //check if the first obj is with the date of 2021-10-20
        expect(res.body[0].date).toBe("2024-09-19T21:00:00.000Z");
    }));
    test("get wall by id trainer and filters", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/wall/" + validObjectId2 + "/getByFilter");
        expect(res.status).toBe(200);
        expect(res.body[0].date).toBe("2024-09-19T21:00:00.000Z");
    }));
    test("get wall by id trainer and filters - EMPTY RES", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/wall/" + validObjectId2 + "/getByFilter")
            .query({ nameInstractor: "Cfir" });
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    }));
});
//# sourceMappingURL=wall.test.js.map