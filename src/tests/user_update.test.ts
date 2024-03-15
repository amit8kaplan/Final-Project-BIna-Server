import initApp from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";


import User from "../models/user_model";
let app: Express;
let accessToken: string;
let id : string;
let newUrl : string;
let user = {
    email: "testStudent@test.com",
    password: "1234567890",
    user_name: "testStudent",
    imgUrl: "",
  }
beforeAll(async () => {
    app = await initApp();
    //////////////console.log("beforeAll");
    await User.deleteMany();

    // User.deleteMany({ 'email': user.email });
    await request(app).post("/auth/register").send(user);
    const response = await request(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
    //////////////console.log("accessToken: " + accessToken);
    //////////////console.log("response.body_id: " + response.body._id);
    id = response.body._id;
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
    
    test("get user by id before upload photo", async () => {
        //////////////console.log("get user by id before upload photo");
        const response = await request(app)
            .get(`/user/${id}`) 
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        //////////////console.log("the used data: "   +response.body);
        // const st = respon;
        expect(response.body.email).toBe(user.email);
    }); 
    
    
    test("upload photo to user", async () => {
        //////////////console.log("upload photo to user");
        const filePath = `${__dirname}/capten.webp`;
        //////////////console.log(filePath);

        try {
            const response = await request(app)
                .post("/user?file=123.webp").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            //////////////console.log(url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            newUrl = url;
            user.imgUrl = url;
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            //////////////console.log(err);
            expect(1).toEqual(2);
        }
    })


        //     expect(response.statusCode).toEqual(200);
        //     let url = response.body.url;
        //     //////////////console.log(url);
        //     url = url.replace(/^.*\/\/[^/]+/, '')
        //     const res = await request(app).get(url)
        //     newUrl = url;
        //     user.imgUrl = url;
        //     expect(res.statusCode).toEqual(200);
        // } catch (err) {
        //     //////////////console.log(err);
        //     expect(1).toEqual(2);
        // }
    test ("change user's data", async () => {
        //////////////console.log("change user's data");
        const response = await request(app)
        .put(`/user/${id}`)
        .set("Authorization", "JWT " + accessToken)
        .send(user)
        expect(response.statusCode).toEqual(200);
        const url = response.body.imgUrl;
        const newuser = response.body._id;
        //////////////console.log("newuser" + newuser);
        //////////////console.log("url" + url);

    });

    test ("get user by id", async () => { 
        //////////////console.log("get user by id");
        const response = await request(app)
            .get(`/user/${id}`)
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        // const st = respon;
        expect(response.body.email).toBe(user.email);
        // expect(response.body.password).toBe(user.password);
    });

    test ("get all users", async () => {
        //////////////console.log("get all users");
        const response = await request(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toBe(1);
        // const st = response.body[0];
        expect(response.body[0].email).toBe(user.email);
        // expect(response.body.password).toBe(user.password);
    });

    test("delete photo from user", async () => {
        //////////////console.log("delete photo from user");
        const response = await request(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        const response2 = await request(app)
            .get(`/user/${id}`) 
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        expect(response2.body.imgUrl).toBe("");
      
    });

    test("upload videq to user instead of img", async () => {
        //////////////console.log("upload photo to user");
        const filePath = `${__dirname}/vid.mp4`;
        //////////////console.log(filePath);

        try {
            const response = await request(app)
                .post("/user?file=123.mp4").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toEqual(500);
            //////////////console.log(response.statusCode);
        } catch (err) {
            //////////////console.log(err);
            expect(1).toEqual(2);
        }
    });
});
