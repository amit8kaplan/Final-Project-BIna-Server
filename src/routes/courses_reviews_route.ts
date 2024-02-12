import express from "express";
const router = express.Router();
import coursesReviewsController from "../controllers/course_reviews_controller";
import authMiddleware from "../common/auth_middleware";

//get all the reviews or specific reviews by the parameters of the query 
router.get("/", coursesReviewsController.get.bind(coursesReviewsController));

router.get("/:id", coursesReviewsController.getByUserId.bind(coursesReviewsController));

//post a new review - the front end should send the course_id and the course_name in the body
//the owner_id and owner_name will be added by the server
router.post("/", authMiddleware, coursesReviewsController.post.bind(coursesReviewsController));

router.put("/:id", authMiddleware, coursesReviewsController.putById.bind(coursesReviewsController));

router.delete("/:id", authMiddleware, coursesReviewsController.deleteById.bind(coursesReviewsController));

export default router;
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
 *             $ref: '#/components/schemas/NewCourseReview'
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

//todo - dont allow to change the owner_id, owner_name, course_id, course_name
/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a course review by ID
 *     description: Update an existing course review by its ID with authentication
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
 *             $ref: '#/components/schemas/CourseReviewUpdate'
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
