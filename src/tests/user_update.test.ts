import initApp from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";

import path from 'path';

import User from "../models/user_model";
import fs from "fs";
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
    //////////////////console.log("beforeAll");
    await User.deleteMany();

    // User.deleteMany({ 'email': user.email });
    await request(app).post("/auth/register").send(user);
    const response = await request(app).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
    //////////////////console.log("accessToken: " + accessToken);
    //////////////////console.log("response.body_id: " + response.body._id);
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
        const response = await request(app)
            .get(`/user/${id}`) 
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toBe(user.email);
    }); 
    
    test ("upload a not good photo to user", async ()=>{
        const filePath = path.join(__dirname, 'NotGoodPhoto.j');
            try {
                const response = await request(app)
                .post('/user')
                .set('Content-Type', 'multipart/form-data')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', filePath);
    
                expect(response.statusCode).toEqual(500);
            } catch (err) {
                expect(1).toEqual(2);
                console.error(err);
            }
        });

    
    test("upload photo to user", async () => {
    
        const filePath = path.join(__dirname, 'capten.webp');

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
        try {
            const response = await request(app)
            .post('/user')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('image', filePath);

            expect(response.statusCode).toEqual(200);
            user.imgUrl = response.body.url;
        } catch (err) {
            console.error(err);
        }
    });


    test ("change user's data", async () => {
        const response = await request(app)
        .put(`/user/${id}`)
        .set("Authorization", "JWT " + accessToken)
        .send(user)
        expect(response.statusCode).toEqual(200);
        const url = response.body.imgUrl;
        const newuser = response.body._id;

    });
    test ("get user by name", async() =>{
        const response = await request(app)
            .get("/user")
            .query({name: user.user_name})
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        
    });

    test ("get user by email", async ()=>{
        const res = await request(app)
        .get("/user")
        .query({email: user.email})
        .set("Authorization", "JWT " + accessToken)
        expect(res.statusCode).toEqual(200);
    })
    test("get user by imgUrl", async () => {
        const response = await request(app)
            .get("/user")
            .query({imgUrl: user.imgUrl})
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
    });

    test ("get user by id", async () => { 
        const response = await request(app)
            .get(`/user/${id}`)
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toBe(user.email);
    });

    test ("get all users", async () => {
        const response = await request(app)
            .get("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].email).toBe(user.email);
    });

    test("delete photo from user", async () => {
        const response = await request(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
    });
    test ("delete photo from user but there is no photo", async ()=>{
        const response = await request(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(500);
    });

    test("upload videq to user instead of img", async () => {

        const filePath = `${__dirname}/vid.mp4`;

        try {
            const response = await request(app)
                .post("/user?file=123.mp4").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toEqual(500);
        } catch (err) {
            expect(1).toEqual(2);
        }
    });
});
