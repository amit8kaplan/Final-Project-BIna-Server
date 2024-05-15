import express from 'express';
const router = express.Router();
import matrics_Controller from '../controllers/matrics_Controller';
import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants';

router.get('/getMegamGradesAvg', matrics_Controller.getMegamGradesAvg.bind(matrics_Controller));

export default router;