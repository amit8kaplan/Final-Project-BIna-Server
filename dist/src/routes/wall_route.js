"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const wall_controller_1 = __importDefault(require("../controllers/wall_controller"));
const response_controller_1 = __importDefault(require("../controllers/response_controller"));
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
//get the wall of the triner
router.get('/:trainerId', wall_controller_1.default.getWallByTrainerId.bind(wall_controller_1.default));
// gets wall by filter
router.get('/getByFilter', wall_controller_1.default.getWallByFilter.bind(wall_controller_1.default));
//gets all the posts
router.get('/posts', post_controller_1.default.getAllPosts.bind(post_controller_1.default));
//get post by trainer id
router.get('/posts/:trainerId', post_controller_1.default.getPostByIdtrainer.bind(post_controller_1.default));
//post new post
router.post('/posts', post_controller_1.default.post.bind(post_controller_1.default));
//update post
router.put('/posts/:id', post_controller_1.default.put.bind(post_controller_1.default));
//delete post
router.delete('/posts/:id', post_controller_1.default.delete.bind(post_controller_1.default));
//gets all the responses
router.get('/responses', response_controller_1.default.getAllResponses.bind(response_controller_1.default));
//get response by post id
router.get('/responses/:postId', response_controller_1.default.getResponseByIdPost.bind(response_controller_1.default));
//get response by dapit id
router.get('/responses/:dapitId', response_controller_1.default.getResponseByIdDapit.bind(response_controller_1.default));
//post new response
router.post('/responses', response_controller_1.default.post.bind(response_controller_1.default));
//update response
router.put('/responses/:id', response_controller_1.default.put.bind(response_controller_1.default));
//delete response
router.delete('/responses/:id', response_controller_1.default.delete.bind(response_controller_1.default));
exports.default = router;
//# sourceMappingURL=wall_route.js.map