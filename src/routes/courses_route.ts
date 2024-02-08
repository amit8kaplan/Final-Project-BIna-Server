import express from "express";
const router = express.Router();
import coursesController from "../controllers/course_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", authMiddleware, coursesController.get.bind(coursesController));

router.get("/:id", authMiddleware, coursesController.getById.bind(coursesController));

router.post("/", authMiddleware, coursesController.post.bind(coursesController));

router.put("/:id", authMiddleware, coursesController.putById.bind(coursesController));

router.delete("/:id", authMiddleware, coursesController.deleteById.bind(coursesController));

export default router;
