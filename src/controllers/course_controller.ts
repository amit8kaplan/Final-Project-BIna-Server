import course_model, { ICourse } from "../models/course_model";
import  { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName} from "../common/utils";
import courses_reviews_model from "../models/courses_reviews_model";
const base = process.env.URL;
import fs from 'fs';
import { FilterQuery } from "mongoose";

class course_controller extends BaseController<ICourse> {
    constructor() {
        super(course_model)
    }

    async get(req: Request, res: Response) {
        try {
            const queryKey = Object.keys(req.query)[0];
            let queryValue = req.query[queryKey];
            
            if (Array.isArray(queryValue)) {
                queryValue = queryValue[0]; 
            }
            
            if (queryKey && queryValue) {
                let filter: FilterQuery<ICourse>;
                
                switch (queryKey) {
                    case 'id':
                        filter = { "_id": queryValue };
                        break;
                    case 'owner_name':
                    case 'name':
                    case 'description':
                        filter = { [queryKey]: { $regex: new RegExp(queryValue as string, 'i') } };
                        break;
                    case 'Count':
                        filter = { Count: { $gte: parseInt(queryValue as string) } };
                        break;
                    default:
                        filter = {};
                        break;
                }
                
                const obj = await this.model.find(filter);
                res.status(200).send(obj);
            } else {
                const obj = await this.model.find();
                res.status(200).send(obj);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
    
    async post(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        try{
            extractUserName (_id).then((result :string) => {
                req.body.owner_name = result;
                req.body.Count = 0;
                req.body.owner = _id;
                super.post(req, res);
            });
        }catch (err) {
            res.status(500).json({ message: err.message });
        }

    }
    async postVideo(req: AuthResquest, res: Response) {
        console.log("post vid")
        try {
            console.log("req.file.pathL" ,req.file.path);
            res.status(200).send({ url: base + req.file.path })
        } catch (err) {
            res.status(500).json({ message: err.message , url : base + req.file.path});
        }
    }
    async getByUserId(req: AuthResquest, res: Response) {

        try {
            const obj = await course_model.find({ owner: req.user._id });
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async putById(req: AuthResquest, res: Response) {
        const oldCourse = await course_model.findById(req.params.id);
        if (oldCourse.Count -1 == req.body.Count
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
        req.query = { _id: req.params.id };
        
        try {
            await courses_reviews_model.deleteMany({ course_id: req.params.id });
            const prevuser = await course_model.findById(req.params.id);
            super.deleteById(req, res);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new course_controller;


