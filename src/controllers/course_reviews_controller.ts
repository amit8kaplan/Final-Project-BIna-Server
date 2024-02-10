import CourseReview, { IcourseReview } from "../models/courses_reviews_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName} from "../common/utils";

class StudentPostController extends BaseController<IcourseReview>{
    constructor() {
        super(CourseReview)
    }
    async get(req: AuthResquest, res: Response) {
        console.log("Get by query parameter:");
        super.get(req, res);
    }
    async post(req: AuthResquest, res: Response) {
        console.log("newReviewToCourse:" + req.body);
        req.body.owner_id = req.user._id;
        console.log("the user id:" + req.body.owner_id);
        try{
             await extractUserName (req.body.owner_id).then((result :string) => {
                req.body.owner_name = result;
                console.log("the user name:" + req.body.owner_name);
            });
        }catch (err) {
            console.log("problem with find the user of the builder of the course" +err);
            res.status(500).json({ message: err.message });
        }
        console.log("rev.title" + req.body.title);
        super.post(req, res);
    }
    async getByUserId(req: AuthResquest, res: Response) {
        console.log("get all the reviews By User Id:" + req.params.id);
        try {
            const obj = await CourseReview.find({ owner_id: req.params.id });
            console.log("obj to getByUserId:" + obj);
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


}

export default new StudentPostController();
