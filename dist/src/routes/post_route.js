"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
//gets all the posts
router.get('/', post_controller_1.default.getAllPosts.bind(post_controller_1.default));
//get post by trainer id
router.get('/:trainerId', post_controller_1.default.getPostByIdtrainer.bind(post_controller_1.default));
//post new post
router.post('', post_controller_1.default.post.bind(post_controller_1.default));
//update post
router.put('/:id', post_controller_1.default.put.bind(post_controller_1.default));
//delete post
router.delete('/:id', post_controller_1.default.delete.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map