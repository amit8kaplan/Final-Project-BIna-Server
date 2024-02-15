import course_model, { ICourse } from "../models/course_model";
import  { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName} from "../common/utils";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import courses_reviews_model from "../models/courses_reviews_model";
import course_reviews_controller from "./course_reviews_controller";
const base = process.env.URL;
import fs from 'fs';

class course_controller extends BaseController<ICourse> {
    constructor() {
        super(course_model)
    }

    async post(req: AuthResquest, res: Response) {
        //////////console.log("newCourse:" + req.body);
        const _id = req.user._id;
        try{
            extractUserName (_id).then((result :string) => {
                //////////console.log("the user name:" + result);
                req.body.owner_name = result;
                req.body.Count = 0;
                req.body.owner = _id;
                super.post(req, res);
            });
        }catch (err) {
            //////////console.log("problem with find the user of the builder of the course" +err);
            res.status(500).json({ message: err.message });
        }

    }
    async postVideo(req: AuthResquest, res: Response) {
        //////////console.log("newVideo:" + base + req.file.path);
        try {
            res.status(200).send({ url: base + req.file.path })
        } catch (err) {
            //////////console.log(err);
            res.status(500).json({ message: err.message , url : base + req.file.path});
        }
    }
    async getByUserId(req: AuthResquest, res: Response) {
        //////////console.log("getByUserId:" + req.params.id);
        try {
            const obj = await course_model.find({ owner: req.params.id });
            //////////console.log("obj to getByUserId:" + obj);
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async putById(req: AuthResquest, res: Response) {
        const oldCourse = await course_model.findById(req.params.id);
        ////////console.log("Request body:", JSON.stringify(req.body, null, 2));

        ////////console.log("oldCourse:", JSON.stringify(oldCourse, null, 2));
        if (oldCourse.owner == req.user._id
             && oldCourse.owner_name == req.body.owner_name
              && oldCourse.id == req.body._id) {
            super.putById(req, res);}
        else {
            res.status(403).json({ message: "you are not allowed to change this course" });
        }
    }
    async deleteById(req: AuthResquest, res: Response) {
        ////////console.log("deleteById:" + req.params.id);
        ////////console.log("req body:", JSON.stringify(req.body, null, 2));
        ////////console.log("req user:", JSON.stringify(req.user, null, 2));
        ////////console.log("req params:", JSON.stringify(req.params, null, 2));
        ////////console.log("req query:", JSON.stringify(req.query, null, 2));
        req.query = { course_id: req.params.id };
        ////////console.log("req query after change:" + JSON.stringify(req.query, null, 2));
        await courses_reviews_model.deleteMany({ course_id: req.params.id }).then((result) => {
            ////////console.log("result" + result);
        });
        let prevuser;
        try {
            prevuser = await course_model.findById(req.params.id);
            //console.log("prevuser" + JSON.stringify(prevuser, null, 2));
            if (prevuser.videoUrl === "") {
                res.status(500).json({ message: "the course has no vid" });
            }
            fs.unlinkSync("./"+prevuser.videoUrl)
            super.deleteById(req, res);
        } catch (err) {
            //console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
}

export default new course_controller;


