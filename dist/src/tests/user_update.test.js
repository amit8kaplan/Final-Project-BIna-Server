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
const path_1 = __importDefault(require("path"));
const user_model_1 = __importDefault(require("../models/user_model"));
const fs_1 = __importDefault(require("fs"));
let app;
let accessToken;
let id;
let newUrl;
let user = {
    email: "testStudent@test.com",
    password: "1234567890",
    user_name: "testStudent",
    imgUrl: "",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    //////////////////console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    // User.deleteMany({ 'email': user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
    //////////////////console.log("accessToken: " + accessToken);
    //////////////////console.log("response.body_id: " + response.body._id);
    id = response.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const student = {
    name: "John Doe",
    _id: "1234567890",
};
describe("File Tests", () => {
    test("get user by id before upload photo", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("get user by id before upload photo");
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/${id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        // //console.log("the used data: "   +response.body);
        //console.log("the user data:", JSON.stringify(response.body));
        // const st = respon;
        expect(response.body.email).toBe(user.email);
    }));
    test("upload a not good photo to user", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, 'NotGoodPhoto.j');
        try {
            const response = yield (0, supertest_1.default)(app)
                .post('/user')
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', filePath);
            expect(response.statusCode).toEqual(500);
            //console.log("response.body: " + JSON.stringify(response.body));
            // //console.log("url" , response.body.imgUrl);
            // user.imgUrl = response.body.url;
            // //console.log("user after url" , user)
        }
        catch (err) {
            expect(1).toEqual(2);
            console.error(err);
        }
    }));
    test("upload photo to user", () => __awaiter(void 0, void 0, void 0, function* () {
        // const filePath = `${__dirname}/capten.webp`;
        const filePath = path_1.default.join(__dirname, 'capten.webp');
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        try {
            const response = yield (0, supertest_1.default)(app)
                .post('/user')
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', filePath);
            expect(response.statusCode).toEqual(200);
            //console.log("response.body: " + JSON.stringify(response.body));
            //console.log("url" , response.body.imgUrl);
            user.imgUrl = response.body.url;
            //console.log("user after url" , user)
        }
        catch (err) {
            console.error(err);
        }
    }));
    test("change user's data", () => __awaiter(void 0, void 0, void 0, function* () {
        //////////////////console.log("change user's data");
        const response = yield (0, supertest_1.default)(app)
            .put(`/user/${id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(user);
        expect(response.statusCode).toEqual(200);
        const url = response.body.imgUrl;
        const newuser = response.body._id;
        //////////////////console.log("newuser" + newuser);
        //////////////////console.log("url" + url);
    }));
    test("get user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        //////////////////console.log("get user by id");
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/${id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        // const st = respon;
        expect(response.body.email).toBe(user.email);
        // expect(response.body.password).toBe(user.password);
    }));
    test("get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        //////////////////console.log("get all users");
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toBe(1);
        // const st = response.body[0];
        expect(response.body[0].email).toBe(user.email);
        // expect(response.body.password).toBe(user.password);
    }));
    test("delete photo from user", () => __awaiter(void 0, void 0, void 0, function* () {
        //////////////////console.log("delete photo from user");
        const response = yield (0, supertest_1.default)(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
        //console.log("delete photo res user ", JSON.stringify(response.body));      
    }));
    test("delete photo from user but there is no photo", () => __awaiter(void 0, void 0, void 0, function* () {
        //////////////////console.log("delete photo from user but there is no photo");
        const response = yield (0, supertest_1.default)(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(500);
        //console.log("delete photo res user ", JSON.stringify(response.body));
    }));
    test("upload videq to user instead of img", () => __awaiter(void 0, void 0, void 0, function* () {
        //////////////////console.log("upload photo to user");
        const filePath = `${__dirname}/vid.mp4`;
        //////////////////console.log(filePath);
        try {
            const response = yield (0, supertest_1.default)(app)
                .post("/user?file=123.mp4").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toEqual(500);
            //////////////////console.log(response.statusCode);
        }
        catch (err) {
            //////////////////console.log(err);
            expect(1).toEqual(2);
        }
    }));
});
//# sourceMappingURL=user_update.test.js.map