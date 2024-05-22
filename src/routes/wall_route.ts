import express, { response } from 'express';
const router = express.Router();
import dapit_Controller from '../controllers/dapit_Controller';
import wall_controller from '../controllers/wall_controller';
import response_controller from '../controllers/response_controller';
import post_controller from '../controllers/post_controller';
import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants';

//get the wall of the triner
router.get('/:trinerId', wall_controller.getWallByTrainerId.bind(wall_controller));
// gets wall by filter
router.get('/getByFilter', wall_controller.getWallByFilter.bind(wall_controller));

//gets all the posts
router.get('/posts', post_controller.getAllPosts.bind(post_controller));
//get post by trainer id
router.get('/posts/:trainerId', post_controller.getPostByIdtrainer.bind(post_controller));
//post new post
router.post('/posts', post_controller.post.bind(post_controller));
//update post
router.put('/posts/:id', post_controller.put.bind(post_controller));
//delete post
router.delete('/posts/:id', post_controller.delete.bind(post_controller));

//gets all the responses
router.get('/responses', response_controller.getAllResponses.bind(response_controller));
//get response by post id
router.get('/responses/:postId', response_controller.getResponseByIdPost.bind(response_controller));
//get response by dapit id
router.get('/responses/:dapitId', response_controller.getResponseByIdDapit.bind(response_controller));
//post new response
router.post('/responses', response_controller.post.bind(response_controller));
//update response
router.put('/responses/:id', response_controller.put.bind(response_controller));
//delete response
router.delete('/responses/:id', response_controller.delete.bind(response_controller));