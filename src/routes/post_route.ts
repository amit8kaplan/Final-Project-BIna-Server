import express from 'express';
const router = express.Router();
import { upload } from '../common/file_upload'; // Import the upload configuration
import {uploadFile} from '../controllers/uploadFile_controller';
import post_controller from '../controllers/post_controller';
import { checkClientSessionAndPermissionToAdmin, checkClientSessionAndPermissionToRegular, checkClientSessionAndPermissionToGroup } from '../controllers/auth_new_controller';

// Gets all the posts
router.get('/', post_controller.getAllPosts.bind(post_controller));
// Get post by trainer id
router.get('/:trainerId', post_controller.getPostByIdtrainer.bind(post_controller));
// Post new post
router.post('/', uploadFile ,post_controller.post.bind(post_controller));
// Update post
router.put('/:id', post_controller.put.bind(post_controller));
// Never use the deleteAllPostWithTrainerId
router.delete('/deleteAllPostWithTrainerId', checkClientSessionAndPermissionToAdmin, post_controller.deleteAllPostWithTrainerId.bind(post_controller));
router.delete('/deleteAll', post_controller.deleteAll.bind(post_controller));
// Delete post
router.delete('/:id', post_controller.delete.bind(post_controller));

export default router;