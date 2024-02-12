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
const course_model_1 = __importDefault(require("../models/course_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let accessToken;
let newUrl;
let userid;
let user_name;
const user = {
    email: "user_check_course@test.com",
    password: "1234567890",
    user_name: "user_check_course",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    //console.log("beforeAll");
    yield course_model_1.default.deleteMany();
    user_model_1.default.deleteMany({ 'email': user.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    //console.log(response.statusCode)
    accessToken = response.body.accessToken;
    //console.log("response.body: " + response.body._id);
    userid = response.body._id;
    //console.log("user_name: " + response.body.user_name);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const course = {
    name: "John Doe",
    description: "data base course",
    videoUrl: "",
    owner: "",
    Count: 0,
    owner_name: "user_check_course",
};
describe("Course tests", () => {
    const addCourse = (course) => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("addCourse");
        const response = yield (0, supertest_1.default)(app).post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(userid);
        expect(response.body.owner_name).toBe(course.owner_name);
        //console.log("response.body.owner_name : " + response.body.owner_name);
    });
    test("Test Get All Courses - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test Get All Courses - empty response");
        const response = yield (0, supertest_1.default)(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Course", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test Post Course");
        yield addCourse(course);
    }));
    test("Test add video to course", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test add video to course");
        const filePath = `${__dirname}/vid.mp4`;
        //console.log("filePath " + filePath);
        try {
            const response = yield (0, supertest_1.default)(app)
                .post("/course/upload_Video?video=123.mp4").attach('video', filePath)
                .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            let url = response.body.url;
            //console.log("url " + url);
            url = url.replace(/^.*\/\/[^/]+/, '');
            const res = yield (0, supertest_1.default)(app).get(url);
            newUrl = url;
            course.videoUrl = url;
            expect(res.statusCode).toBe(200);
        }
        catch (err) {
            //console.log(err);
            expect(1).toBe(2);
        }
    }));
    test("Test Get the specific course using name", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test Get the specific course");
        const response = yield (0, supertest_1.default)(app)
            .get("/course")
            .query({ name: course.name }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.name).toBe(course.name);
    }));
    test("Test get the spesific course by id", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test get the spesific course by id");
        const response = yield (0, supertest_1.default)(app)
            .get(`/course`)
            .query({ _id: course._id }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body[0].name).toBe(course.name);
    }));
    test("Test Get All Courses", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test Get All Courses");
        const response = yield (0, supertest_1.default)(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        //console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.name).toBe(course.name);
        course._id = st._id;
    }));
    test("Test Post duplicate Course", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test Post duplicate Course");
        const response = yield (0, supertest_1.default)(app)
            .post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(406);
    }));
    test("Test Get /course/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test Get /course/:id");
        const response = yield (0, supertest_1.default)(app)
            .get(`/course/${userid}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body[0]._id).toBe(course._id);
    }));
    test("Test PUT /course/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test PUT /course/:id" + `/course/${course._id}`);
        const updateCourse = Object.assign(Object.assign({}, course), { name: "Jane Doe 33", videoUrl: newUrl });
        const response = yield (0, supertest_1.default)(app)
            .put(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updateCourse);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updateCourse.name);
        expect(response.body.videoUrl).toBe(updateCourse.videoUrl);
    }));
    test("Test DELETE /course/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test DELETE /course/:id");
        const response = yield (0, supertest_1.default)(app)
            .delete(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=courses.test.js.map