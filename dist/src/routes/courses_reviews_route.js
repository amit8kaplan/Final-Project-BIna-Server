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
// router.get("/User", authMiddleware, (coursesReviewsController.getUsingSpesificUser.bind(coursesReviewsController)));
//post a new review - the front end should send the course_id and the course_name in the body
//the owner_id and owner_name will be added by the server
router.post("/", auth_middleware_1.default, course_reviews_controller_1.default.post.bind(course_reviews_controller_1.default));
router.put("/:id", auth_middleware_1.default, course_reviews_controller_1.default.putById.bind(course_reviews_controller_1.default));
router.delete("/:id", auth_middleware_1.default, course_reviews_controller_1.default.deleteById.bind(course_reviews_controller_1.default));
exports.default = router;
/**
* @swagger
* tags:
*   name: Course Reviews
*   description: The course reviews management API is used for getting, adding, updating, and deleting course reviews. The server uses JWT for authentication.
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     CourseReview:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         course_id:
 *           type: string
 *         course_name:
 *           type: string
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         score:
 *           type: number
 *         owner_id:
 *           type: string
 *         owner_name:
 *           type: string
 *       required:
 *         - course_id
 *         - course_name
 *         - owner_id
 *         - owner_name
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get course reviews
 *     tags: [Course Reviews]
 *     description: Retrieve course reviews optionally filtered by query parameters
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: ID of the course to filter reviews by
 *       - in: query
 *         name: courseName
 *         schema:
 *           type: string
 *         description: Name of the course to filter reviews by
 *       - in: query
 *         name: ownerName
 *         schema:
 *           type: string
 *         description: Name of the owner to filter reviews by
 *       - in: query
 *         name: score
 *         schema:
 *           type: number
 *         description: Score of the review (1-5) to filter reviews by
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *         description: ID of the owner to filter reviews by
 *     responses:
 *       '200':
 *         description: A list of course reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseReview'
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get course reviews by user ID
 *     tags: [Course Reviews]
 *     description: Retrieve course reviews owned by a specific user based on their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to filter reviews by
 *     responses:
 *       '200':
 *         description: A list of course reviews owned by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseReview'
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new course review
 *     tags: [Course Reviews]
 *     description: Create a new course review with authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseReview'
 *     responses:
 *       '201':
 *         description: Course review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseReview'
 *       '401':
 *         description: Unauthorized request
 *       '406':
 *         description: Failed request, object already exists or other error
 */
/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a course review by Course ID
 *     tags: [Course Reviews]
 *     description: Update an existing course review by its ID with authentication, no valid fields are required to update - all the validateion is inFrontEnd
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseReview'
 *     responses:
 *       '200':
 *         description: Course review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseReview'
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: Course review not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a course review by Course ID
 *     tags: [Course Reviews]
 *     description: Delete an existing course review by its ID with authentication
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course review to delete
 *     responses:
 *       '200':
 *         description: Course review deleted successfully
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */
//# sourceMappingURL=courses_reviews_route.js.map