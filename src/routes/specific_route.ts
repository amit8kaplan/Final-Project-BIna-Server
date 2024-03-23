import express from "express";
const router = express.Router();
import authMiddleware from "../common/auth_middleware";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import CourseReview, { IcourseReview } from "../models/courses_reviews_model";

router.get("/",authMiddleware, async (req: AuthResquest, res: Response) => {
    ////console.log("specfic")
    ////console.log("req.user._id:" + req.user._id);
    try {
        const obj = await CourseReview.find({ owner_id: req.user._id });
        ////console.log("obj to getUsingSpesificUser:" + obj);
        res.status(200).send(obj);
    } catch (err) {
        ////console.log("error")
        res.status(500).json({ message: err.message });
    }
});

export default router;
