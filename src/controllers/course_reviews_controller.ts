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
}

export default new StudentPostController();
