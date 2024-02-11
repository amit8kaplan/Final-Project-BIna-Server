"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CourseReviewSchema = new mongoose_1.default.Schema({
    course_id: {
        type: String,
        required: true,
    },
    course_name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
    },
    message: {
        type: String,
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
exports.default = mongoose_1.default.model("CourseReview", CourseReviewSchema);
//# sourceMappingURL=courses_reviews_model.js.map