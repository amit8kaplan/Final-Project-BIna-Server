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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = __importDefault(require("../models/student_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
const user = {
    email: "testStudent@test.com",
    password: "1234567890",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield student_model_1.default.deleteMany();
    user_model_1.default.deleteMany({ 'email': user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const student = {
    name: "John Doe",
    _id: "1234567890",
};
describe("File Tests", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/capten.webp`;
        console.log(filePath);
        try {
            const response = yield (0, supertest_1.default)(app)
                .post("/file?file=123.webp").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '');
            const res = yield (0, supertest_1.default)(app).get(url);
            expect(res.statusCode).toEqual(200);
        }
        catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    }));
    test("delete file", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/file")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=file.test.js.map