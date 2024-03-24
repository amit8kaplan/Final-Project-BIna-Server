import express from "express";
const router = express.Router();
import authMiddleware from "../common/auth_middleware";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import CourseReview, { IcourseReview } from "../models/courses_reviews_model";

router.get("/",authMiddleware, async (req: AuthResquest, res: Response) => {
    try {
        const obj = await CourseReview.find({ owner_id: req.user._id });
        res.status(200).send(obj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
