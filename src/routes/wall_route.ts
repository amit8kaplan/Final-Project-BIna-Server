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
router.get('/:trainerId', wall_controller.getWallByTrainerId.bind(wall_controller));
// gets wall by filter
router.get('/:trainerId/getByFilter', wall_controller.getWallByFilter.bind(wall_controller));

export default router;