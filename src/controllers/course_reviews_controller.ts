import CourseReview, { IcourseReview } from "../models/courses_reviews_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName, incCountInCourseName, decCountInCourseName} from "../common/utils";
import  { FilterQuery, } from "mongoose";
class coursesReviewsController extends BaseController<IcourseReview>{
    constructor() {
        super(CourseReview)
    }
    async get(req: AuthResquest, res: Response) {
        console.log("get by query parameter:");
        console.log("req.query:", JSON.stringify(req.query, null, 2));
      
        // Check for existence of specific query parameters
        if (req.query.course_id || req.query.owner_id || req.query.score) {
          console.log("Using query parameters");
      
          let filter: FilterQuery<IcourseReview>;
      
          if (req.query.course_id) {
            filter = { course_id: req.query.course_id as string}
            console.log("filter:", filter)
          }
      
          if (req.query.owner_id) {
            filter = { owner_id: req.query.owner_id as string}
          }
      
          if (req.query.score) {
            filter = { score: { $gte: parseInt(req.query.score as string) } }
          }
      
          const obj = await this.model.find(filter);
          res.status(200).send(obj);
        } else {
          console.log("No query parameters provided");
          // Return all documents if no query parameters are specified
          const obj = await this.model.find();
          res.status(200).send(obj);
        }
      }

    async post(req: AuthResquest, res: Response) {
        let UserObj;
        req.body.owner_id = req.user._id;
             await extractUserName (req.body.owner_id).then((result :string) => {
                req.body.owner_name = result;
            });
            const course_idtoInc = req.body.course_id ;
            const count = await incCountInCourseName(course_idtoInc)

        super.post(req, res);
    }
    async getByUserId(req: AuthResquest, res: Response) {
            const obj = await CourseReview.find({ owner_id: req.params.id });
            res.status(200).send(obj);

    }

    async deleteById(req: AuthResquest, res: Response) {
            const review = await CourseReview.findById(req.params.id);
            
            const course_idtodec = review.course_id ;
            await decCountInCourseName(course_idtodec);
            super.deleteById(req, res);
    }
    async putById(req: AuthResquest, res: Response) {
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
