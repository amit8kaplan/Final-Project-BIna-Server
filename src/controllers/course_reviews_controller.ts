import CourseReview, { IcourseReview } from "../models/courses_reviews_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName, incCountInCourseName, decCountInCourseName} from "../common/utils";
import mongoose, { mongo } from "mongoose";
import user_model from "../models/user_model";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
class coursesReviewsController extends BaseController<IcourseReview>{
    constructor() {
        super(CourseReview)
    }
    async get(req: AuthResquest, res: Response) {

        //////console.log("Get by query parameter:");
        //////console.log("req.query:" + JSON.stringify(req.query, null, 2));
        super.get(req, res);
    }
    async post(req: AuthResquest, res: Response) {
        let UserObj;
        //////console.log("newReviewToCourse:" + req.body);
        req.body.owner_id = req.user._id;
        //////console.log("the user id:" + req.body.owner_id);
        try{
             await extractUserName (req.body.owner_id).then((result :string) => {
                req.body.owner_name = result;
                //////console.log("the user name:" + req.body.owner_name);
            });
            const course_idtoInc = req.body.course_id ;
            const count = await incCountInCourseName(course_idtoInc)
            //////console.log("the count of the course++:" + count);
        }catch (err) {
            //////console.log("problem with find the user of the builder " +err);
            res.status(500).json({ message: err.message });
        }
        //////console.log("rev.title" + req.body.title);
        super.post(req, res);
    }
    async getByUserId(req: AuthResquest, res: Response) {
        //////////console.log("get all the reviews By User Id:" + req.params.id);
        try {
            const obj = await CourseReview.find({ owner_id: req.params.id });
            //////////console.log("obj to getByUserId:" + obj);
            res.status(200).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
    async deleteById(req: AuthResquest, res: Response) {
        //////console.log("deleteReviewById:" + req.params.id);
        try{
            const review = await CourseReview.findById(req.params.id);
            
            //////console.log("the review:" + review);
            //////console.log("the review.course_id:" + review.course_id);
            const course_idtodec = review.course_id ;
            const count =await decCountInCourseName(course_idtodec);
            //////console.log("the count of the course--:" + count);
            super.deleteById(req, res);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async putById(req: AuthResquest, res: Response) {
        //console.log("updateReviewById:" + req.params.id);
        //console.log("req.body:" + JSON.stringify(req.body, null, 2));
        const prevReview = await CourseReview.findById(req.params.id);
        if (prevReview.course_id == req.body.course_id
            && prevReview.course_name == req.body.course_name
            && prevReview.owner_id == req.body.owner_id
            && prevReview.owner_name == req.body.owner_name
            && prevReview._id == req.body._id) {
                super.putById(req, res);
        } else {
            res.status(406).send("fail: " + "You can't change the course or the owner of the review");
        }
    }

}

export default new coursesReviewsController();
