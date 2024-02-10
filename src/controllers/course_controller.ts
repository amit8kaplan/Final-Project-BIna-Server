import course_model, { ICourse } from "../models/course_model";
import  { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
const base = process.env.URL;

class course_controller extends BaseController<ICourse> {
    constructor() {
        super(course_model)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("newCourse:" + req.body);
        const _id = req.user._id;
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
}

export default new course_controller;


