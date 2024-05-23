import express, { response } from 'express';
const router = express.Router();
import dapit_Controller from '../controllers/dapit_Controller';
import wall_controller from '../controllers/wall_controller';
import response_controller from '../controllers/response_controller';
import post_controller from '../controllers/post_controller';
import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants';

//gets all the responses
router.get('/', response_controller.getAllResponses.bind(response_controller));
//get response by post id
router.get('/:postId', response_controller.getResponseByIdPost.bind(response_controller));
//get response by dapit id
router.get('/:dapitId', response_controller.getResponseByIdDapit.bind(response_controller));
//post new response
router.post('/', response_controller.post.bind(response_controller));
//update response
router.put('/:id', response_controller.put.bind(response_controller));
//delete response
router.delete('/:id', response_controller.delete.bind(response_controller));

export default router;