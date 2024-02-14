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
const courses_reviews_model_1 = __importDefault(require("../models/courses_reviews_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
let app;
const user = {
    email: "course_review@test.test",
    password: "1234567890",
    user_name: "course_review_tester",
};
let accessToken = "";
const course = {
    name: "course1",
    owner: "", // this is the user id
    owner_name: "",
    description: "description1",
    videoUrl: "",
    Count: 0,
};
const review = {
    course_id: "",
    course_name: "",
    score: 5,
    owner_id: "",
    owner_name: "",
    title: "review1",
    message: "message1",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    ////////console.log("beforeAll");
    yield courses_reviews_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
    course.owner = user._id;
    yield course_model_1.default.deleteMany();
    const response3 = yield (0, supertest_1.default)(app)
        .post("/course")
        .set("Authorization", "JWT " + accessToken)
        .send(course);
    review.course_id = response3.body._id;
    review.course_name = response3.body.name;
    review.owner_id = course.owner;
    review.owner_name = response3.body.owner_name;
    ////////console.log("review.owner_id: " + review.owner_id);
    ////////console.log("review.owner_name: " + review.owner_name);
    ////////console.log("review.course_id: " + review.course_id);
    ////////console.log("review.course_name: " + review.course_name);
    ////////console.log("review.title: " + review.title);
    ////////console.log("course.count: " + response3.body.Count);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Course_reviews tests", () => {
    const addReview = (review) => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("rev.course_id in Course_reviews test: " + review.course_id);
        ////////console.log("rev.tirle in Course_reviews test: " + review.title)
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .send(review);
        review._id = response.body._id;
        ////////console.log("response.body.title: " + response.body.title)
        expect(response.statusCode).toBe(201);
        expect(response.body.owner_id).toBe(review.owner_id);
        expect(response.body.owner_name).toBe(review.owner_name);
        expect(response.body.course_id).toBe(review.course_id);
        expect(response.body.course_name).toBe(review.course_name);
        expect(response.body.title).toBe(review.title);
        expect(response.body.message).toBe(review.message);
        ////////console.log("response.body.message: " + response.body.message);
    });
    test("Test Get All the reviews - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test Get All the reviews - empty response");
        const response = yield (0, supertest_1.default)(app)
            .get("/review");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test review for a course", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test review for a course");
        ////////console.log("review.rev: " + review.title);
        yield addReview(review);
    }));
    test("Test Put review by id", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test Put review by id");
        review.title = "new title";
        review.message = "new message";
        const response = yield (0, supertest_1.default)(app)
            .put(`/review/${review._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(review);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(review.title);
        expect(response.body.message).toBe(review.message);
    }));
    test("Test Put review by id - invalid input", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test Put review by id - invalid input");
        const response = yield (0, supertest_1.default)(app)
            .put(`/review/${review._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(Object.assign(Object.assign({}, review), { course_id: "11d2" }));
        expect(response.statusCode).toBe(406);
    }));
    test("Test check if the count of the course is updated by one", () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log("Test check if the count of the user is updated by one");
        //console.log("review.owner_id: " + review.owner_id);
        const response = yield (0, supertest_1.default)(app)
            .get("/course/")
            .query({ owner: review.owner_id })
            .set("Authorization", "JWT " + accessToken);
        //console.log("Test response:", JSON.stringify(response, null, 2));
        expect(response.statusCode).toBe(200);
        const user = response.body;
        //console.log("Test user:", JSON.stringify(user, null, 2));
        expect(user[0].Count).toBe(1);
    }));
    test("Test Get All reviews [there is only one]", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test Get All reviews  [there is only one]");
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(review.title);
        expect(rc.message).toBe(review.message);
    }));
    test("Test Get reviews by user id", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test Get reviews by user id");
        const response = yield (0, supertest_1.default)(app).get(`/review/${review.owner_id}`);
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(review.title);
        expect(rc.message).toBe(review.message);
    }));
    test("Test Get reviews by course id", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test Get reviews by course id");
        const response = yield (0, supertest_1.default)(app)
            .get(`/review`)
            .query({ course_id: review.course_id });
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(review.title);
        expect(rc.message).toBe(review.message);
    }));
    test("Test Get reviews by course name", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test Get reviews by course name");
        const response = yield (0, supertest_1.default)(app)
            .get(`/review/`)
            .query({ course_name: review.course_name });
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(review.title);
        expect(rc.message).toBe(review.message);
    }));
    test("Test Get reviews by course id and course name", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test Get reviews by course id and course name");
        const response = yield (0, supertest_1.default)(app)
            .get(`/review/`)
            .query({ course_id: review.course_id, course_name: review.course_name });
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(review.title);
        expect(rc.message).toBe(review.message);
    }));
    test("Test delete review by id", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test delete review by id");
        ////////console.log("review._id: " + review._id);
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/${review._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test check if the count of the course is updated by -1 to 0", () => __awaiter(void 0, void 0, void 0, function* () {
        ////////console.log("Test check if the count of the course is updated by -1 to 0");
        const response = yield (0, supertest_1.default)(app)
            .get("/course")
            .query({ owner: review.owner_id })
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        const user = response.body;
        console.log("Test user:", JSON.stringify(user, null, 2));
        expect(user[0].Count).toBe(0);
    }));
});
//# sourceMappingURL=course_reviews.test.js.map