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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const console_1 = require("console");
let app;
const user = {
    email: "test_auth_user@test.com",
    password: "1234567890",
    user_name: "test_auth_user",
};
global.fetch = fetch;
jest.mock('google-auth-library', () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => {
            return {
                verifyIdToken: jest.fn().mockResolvedValue({
                    getPayload: () => ({
                        email: 'test_auth_user@test.com',
                    })
                })
            };
        })
    };
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    (0, console_1.debug)("beforeAll");
    yield user_model_1.default.deleteMany({ 'email': user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let accessToken;
let refreshToken;
let newRefreshToken;
describe("Auth tests", () => {
    test("Test Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(201);
    }));
    test("Test Register exist email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register")
            .send(user);
        expect(response.statusCode).toBe(406);
    }));
    test("Test Register missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(400);
    }));
    /*
    */
    test("Test Register missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/register").send({
            password: "1234567890"
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Incorrect Email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login").send({
            email: "1.com",
            password: "1234567890",
            user_name: "test_auth_user"
        });
        expect(response.statusCode).toBe(401);
    }));
    /*
    */
    test("Test Login missing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login").send({ user_name: "test_auth_user", password: "1234567890" });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/specific");
        expect(response.statusCode).toBe(401);
    }));
    test("Test access with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/specific")
            .set("Authorization", "JWT 1" + accessToken);
        expect(response.statusCode).toBe(401);
    }));
    jest.setTimeout(10000);
    test("Test access after timeout of token", () => __awaiter(void 0, void 0, void 0, function* () {
        const userPayload = { _id: 'someUserId' };
        const shortLivedToken = jsonwebtoken_1.default.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1s' });
        yield new Promise(resolve => setTimeout(resolve, 2000));
        const response = yield (0, supertest_1.default)(app)
            .get("/specific")
            .set("Authorization", `JWT ${shortLivedToken}`);
        expect(response.statusCode).not.toBe(200);
    }), 10000);
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        const newAccessToken = response.body.accessToken;
        newRefreshToken = response.body.refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .get("/course")
            .set("Authorization", "JWT " + newAccessToken);
        expect(response2.statusCode).toBe(200);
    }));
    test("Test logout with null refreshToken or error in jwt", () => __awaiter(void 0, void 0, void 0, function* () {
        const nulltoken = null;
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", "JWT " + nulltoken)
            .send();
        expect(response.statusCode).toBe(400);
    }));
    test("Test Logout with the refreshToken", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/auth/logout")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        newRefreshToken = null;
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app)
            .get("/specific")
            .set("Authorization", "JWT " + newRefreshToken);
        expect(response2.statusCode).toBe(401);
    }));
    test("Test Google Signin", () => __awaiter(void 0, void 0, void 0, function* () {
        const googleIdToken = "dummy_token";
        const response = yield (0, supertest_1.default)(app)
            .post("/auth/google")
            .send({ credential: googleIdToken });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
    }));
});
//# sourceMappingURL=auth.test.js.map