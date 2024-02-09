"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CourseReviewSchema = new mongoose_1.default.Schema({
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model("CourseReview", CourseReviewSchema);
//# sourceMappingURL=courses_reviews_model.js.map