"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
router.post("/register", auth_controller_1.default.register);
router.post("/google", auth_controller_1.default.googleSignin);
router.post("/login", auth_controller_1.default.login);
router.get("/logout", auth_controller_1.default.logout);
router.get("/refresh", auth_controller_1.default.refresh);
router.get("/register/randomphoto", auth_controller_1.default.randomPhoto);
/**
* @swagger
* tags:
*   name: Auth
*   description: The authentication management API is used for registering, logging in, logging out, and refreshing tokens. You can also sign in using Google. The server uses JWT and refresh tokens for authentication. Google login is implemented using OAuth2Client from 'google-auth-library'.
*/
//todo : change to https and add a domain when change it to production
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/
/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*         - user_name
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*         user_name:
*           type: string
*           description: The user name
*         img_url:
*           type: string
*           description: The user image url - if the user sign in with google it will be the google image. Else - the user need to upload the image to /user {post} route. the img_url will be render inside the server to be a random imgae name
*       example:
*         email: 'Amit@gmail.com'
*         password: '123456'
*         user_name: 'Amit'
*/
/**
* @swagger
* /auth/register:
*   post:
*     summary: Register a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       '201':
*         description: New user created successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       '400':
*         description: Missing email or password
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "Missing email or password"
*       '406':
*         description: Email already exists
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "Email already exists"
*/
/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate with Google and get the user data - regi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *             required:
 *               - credential
 *     responses:
 *       '200':
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request
 */
/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 email:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 imgUrl:
 *                   type: string
 *                 user_name:
 *                   type: string
 *       '400':
 *         description: Missing email or password
 *       '401':
 *         description: Email or password incorrect
 */
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout the user
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *       '401':
 *         description: Unauthorized or Invalid token
 */
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: after this you need to copy the accessToken and auth with it
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully refreshed access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       '401':
 *         description: Unauthorized or Invalid token
 */
exports.default = router;
//# sourceMappingURL=auth_route.js.map