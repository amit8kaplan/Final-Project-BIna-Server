import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Course from "../models/course_model";
import { Express } from "express";
import User,  {IUser} from "../models/user_model";

let app: Express;
let accessToken: string;
let newUrl : string;

const user = {
  email: "user_check_course@test.com",
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
  console.log("response.body: " + response.body._id);

});

afterAll(async () => {
  await mongoose.connection.close();
});

interface ICourse {
  name: string;
  _id: string;
  owner?: string;
  videoUrl?: string;
  description?: string;
  Count: number;
}

const course: ICourse = {
  name: "John Doe",
  _id: "1234567890",
  description: "data base course",
  videoUrl: "",
  owner: "ownerId",
  Count: 0,
};

describe("Course tests", () => {
    
    const addCourse = async (course: ICourse) => {
        console.log("addCourse");
        const response = await request(app).post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(201);
    }
    
    test("Test Get All Courses - empty response", async () => {
        console.log("Test Get All Courses - empty response");
        const response = await request(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
    
    test("Test Post Course", async () => {
        console.log("Test Post Course");
        await addCourse(course);
    });   
    test ("Test add video to course", async () => {
        console.log("Test add video to course");
        const filePath = `${__dirname}/vid.mp4`;
        console.log("filePath " + filePath);
        try{
            const response = await request(app)
                .post("/course/upload_Video?video=123.mp4").attach('video', filePath)
                .set("Authorization", "JWT " + accessToken)
            expect(response.statusCode).toBe(200);
            let url = response.body.url;
            console.log("url " + url);
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            newUrl = url;
            course.videoUrl = url;
            expect(res.statusCode).toBe(200);
        } catch (err) {
            console.log(err);
            expect(1).toBe(2);
        }
    });

    test("Test Get the specific course using name", async () => {
        console.log("Test Get the specific course");
        const response = await request(app)
            .get("/course")
            .query({ name: course.name }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            const st = response.body[0];
            expect(st.name).toBe(course.name);
            expect(st._id).toBe(course._id);
    });
    
    test ("Test get the spesific course by id", async () => {
        console.log("Test get the spesific course by id");
        const response = await request(app)
            .get(`/course`)
            .query({ _id: course._id }) // Add your query parameter here
            .set("Authorization", "JWT " + accessToken);
            expect(response.statusCode).toBe(200);
            expect(response.body[0].name).toBe(course.name);
    });

    test ("Test Get All Courses", async () => {
        console.log("Test Get All Courses");
        const response = await request(app)
            .get("/course")
            .set("Authorization", "JWT " + accessToken);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const st = response.body[0];
        expect(st.name).toBe(course.name);
        expect(st._id).toBe(course._id);
    });

    test("Test Post duplicate Course", async () => {
        console.log("Test Post duplicate Course");
        const response = await request(app)
            .post("/course")
            .set("Authorization", "JWT " + accessToken)
            .send(course);
        expect(response.statusCode).toBe(406);
    });

    // // todo: add test for get course by name - not working
    // test("Test Get Course by ID", async () => {
    //     console.log("Test Get Course by ID" + `/course/${course._id}`);
    //     const response = await request(app)
    //         .get(`/course/${course._id}`)
    //         .set("Authorization", "JWT " + accessToken);
    //         expect(response.body.name).toBe(course.name);
    //         console.log(response.body);
    //         expect(response.statusCode).toBe(200);

    // });

    test("Test PUT /course/:id", async () => {
        console.log("Test PUT /course/:id" + `/course/${course._id}`);
        
        const updateCourse = { ...course, name: "Jane Doe 33", videoUrl: newUrl};
        const response = await request(app)
            .put(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send(updateCourse);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updateCourse.name);
        expect(response.body.videoUrl).toBe(updateCourse.videoUrl);
    }  );

    test("Test DELETE /course/:id", async () => {
        console.log("Test DELETE /course/:id");
        const response = await request(app)
            .delete(`/course/${course._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }
    );

});
