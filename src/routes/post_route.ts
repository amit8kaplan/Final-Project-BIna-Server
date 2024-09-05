import express, { response } from 'express';
const router = express.Router();
;
import post_controller from '../controllers/post_controller';
import {checkClientSessionAndPermissionToAdmin, checkClientSessionAndPermissionToRegular, checkClientSessionAndPermissionToGroup} from '../controllers/auth_new_controller';



//gets all the posts
router.get('/', post_controller.getAllPosts.bind(post_controller));
//get post by trainer id
router.get('/:trainerId', post_controller.getPostByIdtrainer.bind(post_controller));
//post new post
router.post('/', post_controller.post.bind(post_controller));
//update post
router.put('/:id', post_controller.put.bind(post_controller));

router.delete('/deleteAllPostWithTrainerId',checkClientSessionAndPermissionToAdmin, post_controller.deleteAllPostWithTrainerId.bind(post_controller));
router.delete('/deleteAll', post_controller.deleteAll.bind(post_controller));
//delete post
router.delete('/:id', post_controller.delete.bind(post_controller));

export default router;