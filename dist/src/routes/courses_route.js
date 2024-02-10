"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const course_controller_1 = __importDefault(require("../controllers/course_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const file_upload_1 = require("../common/file_upload");
//get all the courses or get a course by parameters of the course( id, name, owner, description, videoUrl, Count)
router.get("/", auth_middleware_1.default, course_controller_1.default.get.bind(course_controller_1.default));
//get all the courses of a specific user
router.get("/:id", auth_middleware_1.default, course_controller_1.default.getByUserId.bind(course_controller_1.default));
//upload new course
router.post("/", auth_middleware_1.default, course_controller_1.default.post.bind(course_controller_1.default));
//upload new video
router.post("/upload_Video", auth_middleware_1.default, file_upload_1.upload_vid.single("video"), course_controller_1.default.postVideo.bind(course_controller_1.default));
router.put("/:id", auth_middleware_1.default, course_controller_1.default.putById.bind(course_controller_1.default));
router.delete("/:id", auth_middleware_1.default, course_controller_1.default.deleteById.bind(course_controller_1.default));
exports.default = router;
//# sourceMappingURL=courses_route.js.map