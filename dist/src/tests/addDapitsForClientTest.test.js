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
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield dapit_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Dapit route", () => {
    test("Add dapit", () => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 1; i <= 3; i++) {
            const trainer = "Amit" + i;
            for (let j = 1; j <= 3; j++) {
                const instructor = "Kaplan" + j;
                for (let k = 1; k <= 3; k++) {
                    const session = "session " + k;
                    for (let y = 1; y <= 2; y++) {
                        const silabus = y;
                        const res1 = yield (0, supertest_1.default)(app).get("/dapit/getIDsBaseOnTrainerAndInstractorName")
                            .query({ trainer: trainer, instructor: instructor });
                        const dapit = {
                            nameInstructor: instructor,
                            namePersonalInstructor: res1.body.personalName,
                            nameTrainer: trainer,
                            group: "Group1",
                            idPersonalInstructor: res1.body.PersonalInstractorID,
                            idInstructor: res1.body.InstractorID,
                            idTrainer: res1.body.trainerID,
                            session: session,
                            silabus: silabus,
                            date: new Date("2022-01-01"), // Replace with the desired date
                            tags: ["tag1", "tag2"],
                            identification: { value: 4, description: "good identification" },
                            payload: { value: 5, description: "good payload \n payload  \n payload  \n payload  \n payload" },
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
                            disadvantage: ["disadvantage1", "disadvantage2"],
                            changeTobeCommender: 9,
                            finalGrade: 8,
                            summarize: "good",
                        };
                        const res = yield (0, supertest_1.default)(app).post("/dapit").send(dapit);
                        expect(res.status).toBe(201); // Assuming that the successful response status is 201
                    }
                }
            }
        }
    }));
});
//# sourceMappingURL=addDapitsForClientTest.test.js.map