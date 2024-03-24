import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import CourseReview from "../models/courses_reviews_model";
import User, { IUser } from "../models/user_model";
import Course  from "../models/course_model";

let app: Express;
const user: IUser = {
  email: "course_review@test.test",
  password: "1234567890",
  user_name: "course_review_tester",
}
let accessToken = "";
interface ICourse {
  name: string;
  _id?: string;
  owner: string;
  owner_name: string;
  description: string;
  videoUrl: string;
  Count: number;
}
interface IcourseReview {
  _id?: string;
  course_id: string;
  course_name: string;
  title?: string;
  message?: string;
  score?: number;
  owner_id: string;
  owner_name: string;
}
const course: ICourse = {
    name: "course1",
    owner: "", // this is the user id
    owner_name: "",
    description: "description1",
    videoUrl: "",
    Count: 0,
    };

const review: IcourseReview = {
    course_id: "",
    course_name: "",
    score: 5,
    owner_id: "",
    owner_name: "",
    title: "review1",
    message: "message1",
    };

   
beforeAll(async () => {
    app = await initApp();
    await CourseReview.deleteMany();

    await User.deleteMany({ 'email': user.email });
    const response = await request(app).post("/auth/register").send(user);
    user._id = response.body._id;
    const response2 = await request(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
    course.owner = user._id;
    await Course.deleteMany();
    const response3 = await request(app)
        .post("/course")
        .set("Authorization", "JWT " + accessToken)
        .send(course);
    review.course_id = response3.body._id;
    review.course_name = response3.body.name;
    review.owner_id = course.owner;
    review.owner_name = response3.body.owner_name;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Course_reviews tests", () => {
  const addReview = async (review: IcourseReview) => {
    const response = await request(app)
      .post("/review")
      .set("Authorization", "JWT " + accessToken)
      .send(review);
    review._id = response.body._id;
    expect(response.statusCode).toBe(201);
    expect(response.body.owner_id).toBe(review.owner_id);
    expect(response.body.owner_name).toBe(review.owner_name);
    expect(response.body.course_id).toBe(review.course_id);
    expect(response.body.course_name).toBe(review.course_name);
    expect(response.body.title).toBe(review.title);
    expect(response.body.message).toBe(review.message);
  };

  test("Test Get All the reviews - empty response", async () => {
    const response = await request(app)
        .get("/review")
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test review for a course", async () => {
    await addReview(review);
  });

  test("Test Put review by id", async () => {
    review.title = "new title";
    review.message = "new message";
    const response = await request(app)
      .put(`/review/${review._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send(review);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(review.title);
    expect(response.body.message).toBe(review.message);
  });

  test ("Test Put review by id - invalid input", async () => {
    const response = await request(app)
      .put(`/review/${review._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({...review, course_id: "11d2"});
    expect(response.statusCode).toBe(406);
  });




  test("Test Get All reviews [there is only one]", async () => {
    const response = await request(app).get("/review");
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });

  test("Test Get reviews by user id", async () => {
    const response = await request(app)
    .get(`/review/${review.owner_id}`);
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });
  test("Test Get reviews by user id from spesific route", async () => {
    const response = await request(app)
    .get(`/specific`)
    .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });

  test ("Test Get reviews by course id", async () => {
    const response = await request(app)
    .get(`/review`)
    .query({ course_id: review.course_id });
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });
  test ("Test get reviews by invalid parameter", async () => {
    const response = await request(app)
    .get(`/review`)
    .query({ course_id22: "11d2" }); //return defult all
    expect(response.statusCode).toBe(200);
  });
  test ("test get reviews by no query", async () => {
    const response = await request(app)
    .get(`/review`);
    expect(response.statusCode).toBe(200);
  });
  test ("Test Get reviews by course name", async () => {
    const response = await request(app)
        .get(`/review/`)
        .query({ course_name: review.course_name });
        expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });

  test("Test Get reviews by course id and course name", async () => {
    const response = await request(app)
        .get(`/review/`)
        .query({ course_id: review.course_id, course_name: review.course_name });
        expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });
  test ("test get reviews with score up to spefic score", async ()=>{
    const response = await request(app)
    .get(`/review/`)
    .query({ score: 4 });
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(review.title);
    expect(rc.message).toBe(review.message);
  });
  test("test get reviews with score not good" , async ()=>{
    const response = await request(app)
    .get(`/review/`)
    .query({ score: 7 });
    expect(response.statusCode).toBe(200);
  });

  test("Test delete review by id", async () => {
    const response = await request(app)
      .delete(`/review/${review._id}`)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });


});