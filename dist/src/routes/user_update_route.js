"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const file_upload_1 = require("../common/file_upload");
//get all the users or get a user by parameters of the user
router.get('/', auth_middleware_1.default, user_controller_1.default.get.bind(user_controller_1.default));
// get user by id
router.get('/:id', auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
//change the user's data - canot upload new photo only change the url of the photo and all the data
router.put('/:id', auth_middleware_1.default, user_controller_1.default.putById.bind(user_controller_1.default));
//the codes to change photo of user
router.post('/', auth_middleware_1.default, file_upload_1.upload_img.single("image"), user_controller_1.default.postPhotoOfUser.bind(user_controller_1.default));
router.delete('/', auth_middleware_1.default, user_controller_1.default.deletePhotoOfUser.bind(user_controller_1.default));
module.exports = router;
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users or get a user by parameters
 *     tags: [User]
 *     description: Retrieve all users or retrieve a user by specific parameters with authentication. If parameters are provided, the endpoint returns users matching those parameters. If no parameters are provided, it returns all users.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the user to retrieve (optional)
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     description: Retrieve a user's information by their ID with authentication
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Change user's data
 *     tags: [User]
 *     description: Update a user's data by ID with authentication. Only the URL of the photo and other data can be changed, uploading a new photo is not allowed.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token obtained during login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Change user's photo
 *     tags: [User]
 *     description: Update a user's photo with authentication. Only the URL of the photo can be changed, uploading a new photo file is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token obtained during login
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The image file to upload. Only images (JPEG, PNG, GIF) are allowed.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: User photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: URL of the updated user photo
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete user photo
 *     tags: [User]
 *     description: Delete the photo of the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token obtained during login
 *     responses:
 *       '200':
 *         description: User photo deleted successfully
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 */
//# sourceMappingURL=user_update_route.js.map