import mongoose from "mongoose";

export interface IcourseReview {
    _id: string;
    course_id: string;
    course_name: string;
    title?: string;
    message?: string;
    score?: number;
    owner_id: string;
    owner_name: string;
}

const CourseReviewSchema = new mongoose.Schema<IcourseReview>({
    course_id: {
    type: String,
    required: true,
    },
    course_name:{
    type: String,
    required: true,
    },
    score: {
    type: Number,
    min: 1, 
    max: 5,
    },
    owner_id: {
    type: String,
    required: true,
    },
    owner_name: {
    type: String,
    required: true,
    },
});

export default mongoose.model<IcourseReview>("CourseReview", CourseReviewSchema);
