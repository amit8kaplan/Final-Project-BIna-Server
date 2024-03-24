import course_model, { ICourse } from "../models/course_model";
import  { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName} from "../common/utils";
import courses_reviews_model from "../models/courses_reviews_model";
const base = process.env.URL;
import { FilterQuery } from "mongoose";

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

class course_controller extends BaseController<ICourse> {
    constructor() {
        super(course_model)
    }

    
    async get(req: Request, res: Response) {
        console.log("query", req.query);
        let filter: FilterQuery<ICourse> = {};
    
        if (req.query.id) {
            filter["_id"] = req.query.id as string;
        }
        if (req.query.owner) {
            const escapedOwner = escapeRegExp(req.query.owner as string);
            filter["owner_name"] = { $regex: new RegExp(escapedOwner, 'i') };
        }
        if (req.query.name) {
            const escapedName = escapeRegExp(req.query.name as string);
            filter["name"] = { $regex: new RegExp(escapedName, 'i') };
        }
        if (req.query.description) {
            const escapedDescription = escapeRegExp(req.query.description as string);
            filter["description"] = { $regex: new RegExp(escapedDescription, 'i') };
        }
        if (req.query.Count) {
            filter["Count"] = { $gte: parseInt(req.query.Count as string) };
        }
    
        try {
            const obj = await this.model.find(filter);
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).send({ message: 'Error fetching courses' });
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
        try {
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
        if (oldCourse.owner_name !== req.body.owner_name
             || oldCourse.id !== req.body._id
             || oldCourse.owner !== req.user._id) {
            res.status(403).json({ message: "you are not allowed to change this course" });
             }
        else if (oldCourse.Count - req.body.Count > 1
            || req.body.Count - oldCourse.Count > 1) {
                res.status(403).json({ message: "you are not allowed to change the buying in more then one" });
            }
        else
        {
            super.putById(req, res);
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


