import course_model, { ICourse } from "../models/course_model";
import  { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class course_controller extends BaseController<ICourse>{
    constructor() {
        super(course_model)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("newCourse:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
    }
}

export default new course_controller;


