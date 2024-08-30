import express from 'express';
const router = express.Router();
import UserInfoController from '../controllers/user_info_controller';

import authMiddleware from '../common/auth_middleware';
import { upload_vid } from '../common/file_upload';
import exp from 'constants'; 

router.get('/getAllPersonalInstractors', UserInfoController.getAllPersonalInstractors.bind(UserInfoController));
router.get('/getAllTrainers', UserInfoController.getAllTrainers.bind(UserInfoController));
router.get('/getAllInstractors', UserInfoController.getAllInstractors.bind(UserInfoController));
router.get('/getTrainerByname', UserInfoController.getTrainerByname.bind(UserInfoController));
router.get('/getTrainerById', UserInfoController.getTrainerById.bind(UserInfoController));
router.get('/getInstractorByname', UserInfoController.getInstractorByname.bind(UserInfoController));
router.get('/getInstractorById', UserInfoController.getInstractorById.bind(UserInfoController));
router.get('/getAllGroups', UserInfoController.getAllGroups.bind(UserInfoController));
router.get('/getAllSessions', UserInfoController.getAllSessions.bind(UserInfoController));

router.post('/newPersonalInstractor', UserInfoController.addPersonalInstractor.bind(UserInfoController));
router.post('/newTrainer', UserInfoController.addTrainer.bind(UserInfoController));
router.post('/newInstractor', UserInfoController.addInstractor.bind(UserInfoController));
router.post('/newGroup', UserInfoController.addGroup.bind(UserInfoController));
router.post('/newSession', UserInfoController.addSession.bind(UserInfoController));


router.put('/updateTrainer', UserInfoController.updateTrainer.bind(UserInfoController));
router.put('/updateInstractor', UserInfoController.updateInstractor.bind(UserInfoController));
router.put('/updateGroup', UserInfoController.updateGroup.bind(UserInfoController));
router.put('/updateSession', UserInfoController.updateSession.bind(UserInfoController));
router.put('/updatePersonalInstractor', UserInfoController.updatePersonalInstractor.bind(UserInfoController));
router.put('/updateIdsTrainersInGroup', UserInfoController.updateIdsTrainersInGroup.bind(UserInfoController));


router.delete('/deleteTrainer', UserInfoController.deleteOnlyTrainer.bind(UserInfoController));
router.delete('/deletePersonalInstractorAfterDeleteTrainer', UserInfoController.deletePersonalInstractorAfterDeleteTrainer.bind(UserInfoController));
router.delete('/deleteInstractor', UserInfoController.deleteInstractor.bind(UserInfoController));
router.delete('/deleteTheGroup', UserInfoController.deleteTheGroup.bind(UserInfoController));
router.delete('/deleteSpesificTrainerFromGroup', UserInfoController.deleteSpesificTrainerFromGroup.bind(UserInfoController));
router.delete('/deleteSession', UserInfoController.deleteSession.bind(UserInfoController));
router.delete('/deleteSpesificSilabusFromSession', UserInfoController.deleteSpesificSilabusFromSession.bind(UserInfoController));
router
export default router;