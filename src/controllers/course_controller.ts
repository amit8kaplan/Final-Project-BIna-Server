import course_model, { ICourse } from "../models/course_model";
import  { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import { use } from "../routes/user_update_route";
import user_model from "../models/user_model";
import {extractUserName} from "../common/utils";
const base = process.env.URL;

class course_controller extends BaseController<ICourse> {
    constructor() {
        super(course_model)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("newCourse:" + req.body);
        const _id = req.user._id;
        try{
            extractUserName (_id).then((result :string) => {
                console.log("the user name:" + result);
                req.body.owner_name = result;
            });
        }catch (err) {
            console.log("problem with find the user of the builder of the course" +err);
            res.status(500).json({ message: err.message });
        }
        req.body.owner = _id;
        super.post(req, res);
    }
    async postVideo(req: AuthResquest, res: Response) {
        console.log("newVideo:" + base + req.file.path);
        try {
            res.status(200).send({ url: base + req.file.path })
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message , url : base + req.file.path});
        }
    }
    async getByUserId(req: AuthResquest, res: Response) {
        console.log("getByUserId:" + req.params.id);
        try {
            const obj = await course_model.find({ owner: req.params.id });
            console.log("obj to getByUserId:" + obj);
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new course_controller;


