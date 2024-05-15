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
const dapitPerformanceSchema = new mongoose_1.default.Schema({
    value: Number,
    description: String,
});
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
let firstDapitId;
describe('matrics tests', () => {
    //the first trainer loop of 20 dapitos for group A , every dapit is different from the other - in the grade only
    for (let g = 0; g < 3; g++) {
        dapit.group = String.fromCharCode(65 + g);
        for (let name = 0; name < 4; name++) {
            dapit.nameTrainer = "trainer" + name;
            for (let i = 0; i < 5; i++) {
                test("add dapiot for trainer 1, group A, session 1, silabos 1-5", () => __awaiter(void 0, void 0, void 0, function* () {
                    dapit.silabus = i;
                    dapit.identfication.value = i + 5;
                    dapit.payload.value = i + 5;
                    dapit.decryption.value = i + 5;
                    dapit.workingMethod.value = i + 5;
                    dapit.understandingTheAir.value = i + 5;
                    dapit.flight.value = i + 5;
                    dapit.theoretical.value = i + 5;
                    dapit.thinkingInAir.value = i + 5;
                    dapit.safety.value = i + 5;
                    dapit.briefing.value = i + 5;
                    dapit.debriefing.value = i + 5;
                    dapit.debriefingInAir.value = i + 5;
                    dapit.implementationExecise.value = i + 5;
                    dapit.dealingWithFailures.value = i + 5;
                    dapit.dealingWithStress.value = i + 5;
                    dapit.makingDecisions.value = i + 5;
                    dapit.pilotNature.value = i + 5;
                    dapit.crewMember.value = i + 5;
                    dapit.finalGrade = i + 5;
                    dapit.changeTobeCommender = i + 5;
                    const res = yield (0, supertest_1.default)(app)
                        .post('/dapit')
                        .send(dapit);
                    expect(res.statusCode).toBe(200);
                }));
            }
        }
    }
    test("get all dapit", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/dapit');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(100);
    }));
});
//# sourceMappingURL=matics.test.js.map