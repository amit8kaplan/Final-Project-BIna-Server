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
import { FilterQuery } from "mongoose";

class course_controller extends BaseController<ICourse> {
    constructor() {
        super(course_model)
    }
    async get(req: Request, res: Response) {
        try {
            const queryKey = Object.keys(req.query)[0]; // Get the first query parameter
            const queryValue = req.query[queryKey]; // Get the value of the first query parameter
            // //console.log("queryKey:" + queryKey);
            // //console.log("queryValue:" + queryValue);
            if (queryKey && queryValue) {
                let filter: FilterQuery<ICourse>;
    
                switch (queryKey) {
                    case 'id':
                        filter = { "_id": queryValue };
                        break;
                    case 'owner_name':
                    case 'name':
                    case 'description':
                        // Use regular expression for partial match
                        filter = { [queryKey]: { $regex: new RegExp(String(queryValue), 'i') } };
                        break;
                    case 'Count':
                        //console.log("Count:" + queryValue);
                        // Check if the Count in the result is greater than the client sent value
                        filter = { Count: { $gte: parseInt(queryValue as string) } };
                        break;
                    default:
                        // Return all documents if the query key is not recognized
                        filter = {};
                        //console.log("defult")
                        break;
                }
    
                const obj = await this.model.find(filter);
                res.status(200).send(obj);
            } else {
                // If no query parameters provided, return all documents
                const obj = await this.model.find();
                res.status(200).send(obj);
            }
        } catch (err) {
            //console.log("err" +err);
            res.status(500).json({ message: err.message });
        }
    }
    
    async post(req: AuthResquest, res: Response) {
        //////console.log("all the req" + JSON.stringify(req, getCircularReplacer(), 2));
        //////console.log("newCourse:" + JSON.stringify(req.body, null, 2));
        //////console.log("the course des:" + req.body.description);
        //////console.log("the course name:" + req.body.name);
        // //////console.log("newCourse:" + req.body);
        const _id = req.user._id;
        try{
            extractUserName (_id).then((result :string) => {
                //////console.log("the user name:" + result);
                req.body.owner_name = result;
                req.body.Count = 0;
                req.body.owner = _id;
                super.post(req, res);
            });
        }catch (err) {
            //////console.log("problem with find the user of the builder of the course" +err);
            res.status(500).json({ message: err.message });
        }

    }
    async postVideo(req: AuthResquest, res: Response) {
        //console.log("newVideo:" + base + req.file.path);
        try {
            res.status(200).send({ url: base + req.file.path })
        } catch (err) {
            //console.log(err);
            res.status(500).json({ message: err.message , url : base + req.file.path});
        }
    }
    async getByUserId(req: AuthResquest, res: Response) {
        //console.log("getByUserId:" + req.params.id);
        //console.log("req.user._id:" + req.user._id)

        try {
            const obj = await course_model.find({ owner: req.user._id });
            // //console.log("obj to getByUserId:" + obj);
            //console.log("obj to getByUserId:" + JSON.stringify(obj, null, 2));
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async putById(req: AuthResquest, res: Response) {
        const oldCourse = await course_model.findById(req.params.id);
        //////////////console.log("Request body:", JSON.stringify(req.body, null, 2));

        //////////////console.log("oldCourse:", JSON.stringify(oldCourse, null, 2));
        if (oldCourse.Count-1 == req.body.Count
            && oldCourse.owner_name == req.body.owner_name
            && oldCourse.id == req.body._id
            && (oldCourse.description != ''  || oldCourse.description ==req.body.description)
            && oldCourse.name == req.body.name
            && oldCourse.videoUrl != '' || oldCourse.videoUrl == req.body.videoUrl) {
            super.putById(req, res);
            }
        
        else if (oldCourse.owner == req.user._id
             && oldCourse.owner_name == req.body.owner_name
              && oldCourse.id == req.body._id) {
            super.putById(req, res);}
        else {
            res.status(403).json({ message: "you are not allowed to change this course" });
        }
    }
    async deleteById(req: AuthResquest, res: Response) {
        //////////////console.log("deleteById:" + req.params.id);
        //////////////console.log("req body:", JSON.stringify(req.body, null, 2));
        //////////////console.log("req user:", JSON.stringify(req.user, null, 2));
        //////////////console.log("req params:", JSON.stringify(req.params, null, 2));
        //////////////console.log("req query:", JSON.stringify(req.query, null, 2));
        req.query = { _id: req.params.id };
        //console.log("req query after change:" + JSON.stringify(req.query, null, 2));
        //////////////console.log("req query after change:" + JSON.stringify(req.query, null, 2));
        
        try {
            await courses_reviews_model.deleteMany({ course_id: req.params.id });
            const prevuser = await course_model.findById(req.params.id);
            //console.log("prevuser" + JSON.stringify(prevuser, null, 2));
            // fs.unlinkSync("./"+prevuser.videoUrl)
            super.deleteById(req, res);
        } catch (err) {
            ////////console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
}

export default new course_controller;


