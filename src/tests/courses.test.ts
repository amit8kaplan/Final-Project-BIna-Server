import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Course from "../models/course_model";
import { Express, response } from "express";
import User,  {IUser} from "../models/user_model";
import path from 'path';
import * as fs from 'fs';
import mockFs from 'mock-fs';

let app: Express;
let accessToken: string;
let newUrl : string;
let userid : string;
let user_name :string
const user = {
  email: "user_check_course@test.com",
  password: "1234567890",
  user_name: "user_check_course",
}
beforeAll(async () => {
  app = await initApp();
  //console.log("beforeAll");
  await Course.deleteMany();

  User.deleteMany({ 'email': user.email });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  expect(response.statusCode).toBe(200);
  //////////////////console.log(response.statusCode)
  accessToken = response.body.accessToken;
  //////////////////console.log("response.body: " + response.body._id);
  userid = response.body._id;
  //////////////////console.log("user_name: " + response.body.user_name);
});

afterAll(async () => {
  await mongoose.connection.close();
});

interface ICourse {
  name: string;
  _id?: string;
  owner?: string;
  owner_name: string;
  videoUrl?: string;
  description?: string;
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
const review :IcourseReview = {
    course_id: "",
    course_name: "",
    score: 5,
    owner_id: "",
    owner_name: "",
    title: "review1",
    message: "message1",
};

const course: ICourse = {
  name: "John Doe",
  description: "data base course",
  videoUrl: "",
  owner: "",
  Count: 0,
  owner_name: "user_check_course",
};

describe("Course tests", () => {
    
    const addCourse = async (course: ICourse) => {
        const response = await request(app).post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);      
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(userid);
        expect(response.body.owner_name).toBe(course.owner_name);
    }
    
    test("Test Get All Courses - empty response", async () => {
        const response = await request(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
    
    test("Test Post Course", async () => {
        await addCourse(course);
    });   
    
    test("Test Get the specific course using name", async () => {
        const response = await request(app)
            .get("/course")
            .query({ name: course.name }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            const st = response.body[0];
            expect(st.name).toBe(course.name);
    });
    test ("test get the spesific course by description", async () => {
        const response = await request(app)
            .get(`/course`)
            .query({ description: course.description }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            const st = response.body[0];
            expect(st.description).toBe(course.description);
    });
    
    test ("test get the spesific course by owner name", async () => {
        const response = await request(app)
            .get(`/course`)
            .query({ owner_name: course.owner_name }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            const st = response.body[0];
            expect(st.owner_name).toBe(course.owner_name);
    });

    test("test get the spesific course by count", async()=>{
        const response = await request(app)
            .get(`/course`)
            .query({ Count: course.Count }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            const st = response.body[0];
            expect(st.Count).toBe(course.Count);
    });

    test ("Test get the spesific course by id", async () => {
        const response = await request(app)
            .get(`/course`)
            .query({ _id: course._id }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body[0].name).toBe(course.name);
    });
    
    test ("Test Get All Courses", async () => {
        const response = await request(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.name).toBe(course.name);
        course._id = st._id;
    });

    test("Test Post duplicate Course", async () => {
        const response = await request(app)
            .post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(406);
    });
    test("Test Get /course/:id", async () => {
        const response = await request(app)
            .get(`/course/${userid}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body[0]._id).toBe(course._id); 
    });

    test("Test PUT /course/:id", async () => {
        
        const updateCourse = { ...course, name: "Jane Doe 33"};
        course.name = updateCourse.name;
        const response = await request(app)
            .put(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updateCourse);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updateCourse.name);
        course.videoUrl = updateCourse.videoUrl;
    });

    test("Test add review to course", async () => {
        review.course_id = course._id;
        review.course_name = course.name;
        const response = await request(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .send(review);
        review._id = response.body._id;
        review.owner_id = course.owner;
        review.owner_name = response.body.owner_name;
        expect(response.statusCode).toBe(201);
        const res2 = await request(app)
            .get(`/course`)
            .query({ _id: course._id }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
        expect(res2.statusCode).toBe(200);
        expect(res2.body[0].name).toBe(course.name);
        expect(res2.body[0].Count).toBe(1);
    
    });
    
    test("Test delete is delting the course review", async () => {
        const response = await request(app)
            .delete(`/review/${review._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        const res2 = await request(app)
            .get(`/course`)
            .query({ _id: course._id }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
        expect(res2.statusCode).toBe(200);
        expect(res2.body[0].name).toBe(course.name);
        expect(res2.body[0].Count).toBe(0);
    });

    test ("Test Delete not good", async () =>{
        const response = await request(app)
            .delete(`/course/111234`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(500);
    })
    test("Test DELETE /course/:id", async () => {
        const response = await request(app)
            .delete(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    });

});
