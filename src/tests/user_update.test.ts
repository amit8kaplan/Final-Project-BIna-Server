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
        //console.log("get user by id before upload photo");
        const response = await request(app)
            .get(`/user/${id}`) 
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        // //console.log("the used data: "   +response.body);
        //console.log("the user data:", JSON.stringify(response.body));
        // const st = respon;
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
                //console.log("response.body: " + JSON.stringify(response.body));
                // //console.log("url" , response.body.imgUrl);
                // user.imgUrl = response.body.url;
                // //console.log("user after url" , user)
            } catch (err) {
                expect(1).toEqual(2);
                console.error(err);
            }
        });

    
    test("upload photo to user", async () => {
        // const filePath = `${__dirname}/capten.webp`;
    
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
            //console.log("response.body: " + JSON.stringify(response.body));
            //console.log("url" , response.body.imgUrl);
            user.imgUrl = response.body.url;
            //console.log("user after url" , user)
        } catch (err) {
            console.error(err);
        }
    });


    test ("change user's data", async () => {
        //////////////////console.log("change user's data");
        const response = await request(app)
        .put(`/user/${id}`)
        .set("Authorization", "JWT " + accessToken)
        .send(user)
        expect(response.statusCode).toEqual(200);
        const url = response.body.imgUrl;
        const newuser = response.body._id;
        //////////////////console.log("newuser" + newuser);
        //////////////////console.log("url" + url);

    });
    test ("get user by name", async() =>{
        //////////////////console.log("get user by name");
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
        //////////////////console.log("get user by imgUrl");
        const response = await request(app)
            .get("/user")
            .query({imgUrl: user.imgUrl})
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
    });

    test ("get user by id", async () => { 
        //////////////////console.log("get user by id");
        const response = await request(app)
            .get(`/user/${id}`)
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        // const st = respon;
        expect(response.body.email).toBe(user.email);
        // expect(response.body.password).toBe(user.password);
    });

    test ("get all users", async () => {
        //////////////////console.log("get all users");
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
        //////////////////console.log("delete photo from user");
        const response = await request(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(200);
        //console.log("delete photo res user ", JSON.stringify(response.body));      
    });
    test ("delete photo from user but there is no photo", async ()=>{
        //////////////////console.log("delete photo from user but there is no photo");
        const response = await request(app)
            .delete("/user")
            .set("Authorization", "JWT " + accessToken)
        expect(response.statusCode).toEqual(500);
        //console.log("delete photo res user ", JSON.stringify(response.body));
    });

    test("upload videq to user instead of img", async () => {
        //////////////////console.log("upload photo to user");
        const filePath = `${__dirname}/vid.mp4`;
        //////////////////console.log(filePath);

        try {
            const response = await request(app)
                .post("/user?file=123.mp4").attach('file', filePath)
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toEqual(500);
            //////////////////console.log(response.statusCode);
        } catch (err) {
            //////////////////console.log(err);
            expect(1).toEqual(2);
        }
    });
});
