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
// //get all the likes of the wall {key: idDapitOrPost, value: number of likes}
router.get ('/likes/:trainerId', wall_controller.getLikes.bind(wall_controller));
// //put new like by id Post or Dapit
router.put('/likes/', wall_controller.putLike.bind(wall_controller));

//post a new like by id Post or Dapit
router.post('/likes/', wall_controller.postLike.bind(wall_controller));

router.put('/flag/', wall_controller.changeFlag.bind(wall_controller));



router.get('/comments/:trainerId', wall_controller.getComments.bind(wall_controller));
router.post('/comments/', wall_controller.postComment.bind(wall_controller));
router.put('/comments/', wall_controller.putComment.bind(wall_controller));
router.delete('/comments/', wall_controller.deleteComment.bind(wall_controller));

export default router;