import initApp from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import Student from "../models/student_model";

import User from "../models/user_model";
let app: Express;
let accessToken: string;
const user = {
    email: "testStudent@test.com",
    password: "1234567890",
  }
beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await Student.deleteMany();

    User.deleteMany({ 'email': user.email });
    await request(app).post("/auth/register").send(user);
    const response = await request(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
});

afterAll(async () => {
    await mongoose.connection.close();
});
interface IStudent {
    name: string;
    _id: string;
  }
const student: IStudent = {
    name: "John Doe",
    _id: "1234567890",
  };
  

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/capten.webp`;
        console.log(filePath);

        try {
            const response = await request(app)
                .post("/file?file=123.webp").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
    
    test("delete file", async () => {
            const response = await request(app)
                .delete("/file")
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toEqual(200);
      
    })

})
