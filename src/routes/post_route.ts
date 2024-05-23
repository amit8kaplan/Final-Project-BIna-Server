import express, { response } from 'express';
const router = express.Router();
import dapit_Controller from '../controllers/dapit_Controller';
import wall_controller from '../controllers/wall_controller';
import response_controller from '../controllers/response_controller';
import post_controller from '../controllers/post_controller';
import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants';


//gets all the posts
router.get('/', post_controller.getAllPosts.bind(post_controller));
//get post by trainer id
router.get('/:trainerId', post_controller.getPostByIdtrainer.bind(post_controller));
//post new post
router.post('', post_controller.post.bind(post_controller));
//update post
router.put('/:id', post_controller.put.bind(post_controller));
//delete post
router.delete('/:id', post_controller.delete.bind(post_controller));

export default router;