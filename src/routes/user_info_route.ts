import express from 'express';
const router = express.Router();
import UserInfoController from '../controllers/user_info_controller';
import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants'; 


router.get('/getTrainerByname', UserInfoController.getTrainerByname.bind(UserInfoController));
router.get('/getTrainerById', UserInfoController.getTrainerById.bind(UserInfoController));
router.get('/getInstractorByname', UserInfoController.getInstractorByname.bind(UserInfoController));
router.get('/getInstractorById', UserInfoController.getInstractorById.bind(UserInfoController));

export default router;