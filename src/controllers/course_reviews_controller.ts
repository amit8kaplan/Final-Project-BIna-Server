import CourseReview, { IcourseReview } from "../models/courses_reviews_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class StudentPostController extends BaseController<IcourseReview>{
    constructor() {
        super(CourseReview)
    }

    async post(req: AuthResquest, res: Response) {
        console.log("newReviewToCourse:" + req.body);
        const user = req.user;
        req.body.owner = user;
        super.post(req, res);
    }
    async getByUserId(req: AuthResquest, res: Response) {
        console.log("get all the reviews By User Id:" + req.params.id);
        try {
            const obj = await CourseReview.find({ owner: req.params.id });
            console.log("obj to getByUserId:" + obj);
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

export default new StudentPostController();
