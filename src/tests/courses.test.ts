import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Course from "../models/course_model";
import { Express } from "express";
import User,  {IUser} from "../models/user_model";

let app: Express;
let accessToken: string;
const user = {
  email: "testStudent@test.com",
  password: "1234567890",
}
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Course.deleteMany();

  User.deleteMany({ 'email': user.email });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

interface ICourse {
  name: string;
  _id: string;
  owner?: IUser;
  description?: string;
  Count: number;
}

const course: ICourse = {
  name: "John Doe",
  _id: "1234567890",
  description: "data base course",
  owner: user,
  Count: 0,
};

describe("Course tests", () => {
    
    const addCourse = async (course: ICourse) => {
        const response = await request(app).post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(201);
    }
    
    test("Test Get All Courses - empty response", async () => {
        const response = await request(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
    
    test("Test Post Course", async () => {
        addCourse(course);
    });   
    
    test ("Test Get All Courses with one course in DB", async () => {
        const response = await request(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.name).toBe(course.name);
        expect(st._id).toBe(course._id);
    });

    test("Test Post duplicate Course", async () => {
        const response = await request(app)
            .post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(406);
    });

    test("Test Get Course by ID", async () => {
        const response = await request(app)
            .get(`/course/${course._id}`)
            .set(" Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(course.name);
    });

    test("Test PUT /course/:id", async () => {
        const updatedStudent = { ...course, name: "Jane Doe 33" };
        const response = await request(app)
            .put(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updatedStudent);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedStudent.name);
    }  );

    test("Test DELETE /course/:id", async () => {
        const response = await request(app)
            .delete(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }
    );

});
