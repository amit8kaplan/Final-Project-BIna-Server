"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const course_reviews_controller_1 = __importDefault(require("../controllers/course_reviews_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
//get all the reviews or specific reviews by the parameters of the query 
router.get("/", course_reviews_controller_1.default.get.bind(course_reviews_controller_1.default));
router.get("/:id", course_reviews_controller_1.default.getByUserId.bind(course_reviews_controller_1.default));
router.post("/", auth_middleware_1.default, course_reviews_controller_1.default.post.bind(course_reviews_controller_1.default));
router.put("/:id", auth_middleware_1.default, course_reviews_controller_1.default.putById.bind(course_reviews_controller_1.default));
router.delete("/:id", auth_middleware_1.default, course_reviews_controller_1.default.deleteById.bind(course_reviews_controller_1.default));
exports.default = router;
//# sourceMappingURL=courses_reviews._route.js.map