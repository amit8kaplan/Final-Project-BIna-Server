import express from "express";
const router = express.Router();
import coursesController from "../controllers/course_controller";
import authMiddleware from "../common/auth_middleware";
import { upload_vid } from "../common/file_upload";
//get all the courses or get a course by name
router.get("/", authMiddleware, coursesController.get.bind(coursesController));
//get all the courses of a specific user
// router.get("/:id", authMiddleware, coursesController.getByUserId.bind(coursesController));
//get course by id
router.get("/:CourseId", authMiddleware, coursesController.getById.bind(coursesController));

//upload new course
router.post("/", authMiddleware, coursesController.post.bind(coursesController));
//upload new video
router.post("/upload_Video", authMiddleware, upload_vid.single("video"), coursesController.postVideo.bind(coursesController));
router.put("/:id", authMiddleware, coursesController.putById.bind(coursesController));

router.delete("/:id", authMiddleware, coursesController.deleteById.bind(coursesController));

export default router;
