import express from "express";
const router = express.Router();
import coursesReviewsController from "../controllers/course_reviews_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", coursesReviewsController.get.bind(coursesReviewsController));

router.get("/:id", coursesReviewsController.getById.bind(coursesReviewsController));

router.post("/", authMiddleware, coursesReviewsController.post.bind(coursesReviewsController));

router.put("/:id", authMiddleware, coursesReviewsController.putById.bind(coursesReviewsController));

router.delete("/:id", authMiddleware, coursesReviewsController.deleteById.bind(coursesReviewsController));

export default router;
