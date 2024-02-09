import mongoose from "mongoose";
import { ICourse } from "./course_model";

export interface IcourseReview {
    _id: string;
    course: ICourse;
    title: string;
    message: string;
    imgUrl?: string;
    score: number;
    owner: string;
}

const CourseReviewSchema = new mongoose.Schema<IcourseReview>({
    course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    },
    title: {
    type: String,
    required: true,
    },
    message: {
    type: String,
    required: true,
    },
    imgUrl: {
        type: String,
      },
    score: {
    type: Number,
    min: 1, 
    max: 5,
    },
    owner: {
    type: String,
    required: true,
    },
});

export default mongoose.model<IcourseReview>("CourseReview", CourseReviewSchema);
