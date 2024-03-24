import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import jwt from 'jsonwebtoken';
import { createApi } from "unsplash-js";

let app: Express;
const user = {
  email: "test_auth_user@test.com",
  password: "1234567890",
  user_name: "test_auth_user",
}

global.fetch = fetch;



  jest.mock('google-auth-library', () => {
    return {
      OAuth2Client: jest.fn().mockImplementation(() => {
        return {
          verifyIdToken: jest.fn().mockResolvedValue({
            getPayload: () => ({
              email: 'test_auth_user@test.com',
            })
          })
        };
      })
    };
  });


beforeAll(async () => {
  app = await initApp();
  await User.deleteMany({ 'email': user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app)
      .post("/auth/register").send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });
/*
*/
  test ("Test Register missing email", async () => {
    const response = await request(app)
      .post("/auth/register").send({
        password : "1234567890"
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test Incorrect Email", async () => {
    const response = await request(app)
      .post("/auth/login").send({
        email: "1.com",
        password: "1234567890",
        user_name: "test_auth_user"
      });
    expect(response.statusCode).toBe(401);
  });
/*
*/
  test ("Test Login missing email", async () => {
    const response = await request(app)
      .post("/auth/login").send({user_name: "test_auth_user", password: "1234567890"});
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app)
      .post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/specific");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/course")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/specific")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);
  



  test("Test access after timeout of token", async () => {

    const userPayload = { _id: 'someUserId' }; 
    const shortLivedToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1s' });
  
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    const response = await request(app)
      .get("/specific") 
      .set("Authorization", `JWT ${shortLivedToken}`);
  
    expect(response.statusCode).not.toBe(200);
  }, 10000); 
  
  


  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/course")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("Test logout with null refreshToken or error in jwt", async () => {
    const nulltoken = null
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + nulltoken)
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("Test Logout with the refreshToken", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + newRefreshToken)
      .send();
    newRefreshToken = null;
    expect(response.statusCode).toBe(200);
    const response2 = await request(app)
      .get("/specific")
      .set("Authorization", "JWT " + newRefreshToken);
    expect(response2.statusCode).toBe(401);
  });

  test("Test Google Signin", async () => {
    const googleIdToken = "dummy_token";
    const response = await request(app)
      .post("/auth/google")
      .send({ credential: googleIdToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });  

});

