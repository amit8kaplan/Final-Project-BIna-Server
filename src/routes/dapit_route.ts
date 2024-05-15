import express from 'express';
const router = express.Router();
import dapit_Controller from '../controllers/dapit_Controller';
import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants';

//gets all the dapit
router.get('/', dapit_Controller.get.bind(dapit_Controller));
//gets by tags

// router.get('/getByTags', dapit_Controller.getByTags.bind(dapit_Controller));
// //gets by filter
router.get('/getByFilterBasicInfo', dapit_Controller.getByFilterBasicInfo.bind(dapit_Controller));

router.get('/getByFilter', dapit_Controller.getByFilter.bind(dapit_Controller));

// router.get('/:id', dapit_Controller.getByUserId.bind(dapit_Controller));
// router.get('/getByTrainer/:id', dapit_Controller.getByTrainer.bind(dapit_Controller));
// router.get('/getByPersonalInstractor/:id', dapit_Controller.getByPersonalInstractor.bind(dapit_Controller));
// router.get('/getByInstractor/:id', dapit_Controller.getByInstractor.bind(dapit_Controller));
// router.get('/getByGroup/:id', dapit_Controller.getByGroup.bind(dapit_Controller));
// router.get('/getByRangeDate/:id', dapit_Controller.getByDate.bind(dapit_Controller));

router.post('/', dapit_Controller.post.bind(dapit_Controller));

// router.put('/:id', dapit_Controller.putById.bind(dapit_Controller));

// router.delete('/:id', dapit_Controller.deleteById.bind(dapit_Controller));

export default router;