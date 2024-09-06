import express from 'express';
const router = express.Router();
import UserInfoController from '../controllers/user_info_controller';
import {checkClientSessionAndPermissionToAdmin, checkClientSessionAndPermissionToRegular, checkClientSessionAndPermissionToGroup} from '../controllers/auth_new_controller';
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

router.post('/newPersonalInstractor',checkClientSessionAndPermissionToAdmin, UserInfoController.addPersonalInstractor.bind(UserInfoController));
router.post('/newTrainer',checkClientSessionAndPermissionToAdmin, UserInfoController.addTrainer.bind(UserInfoController));
router.post('/newInstractor',checkClientSessionAndPermissionToAdmin, UserInfoController.addInstractor.bind(UserInfoController));
router.post('/newGroup',checkClientSessionAndPermissionToAdmin, UserInfoController.addGroup.bind(UserInfoController));
router.post('/newSession',checkClientSessionAndPermissionToAdmin, UserInfoController.addSession.bind(UserInfoController));


router.put('/updateTrainer', checkClientSessionAndPermissionToAdmin ,UserInfoController.updateTrainer.bind(UserInfoController));
router.put('/updateInstractor',checkClientSessionAndPermissionToAdmin, UserInfoController.updateInstractor.bind(UserInfoController));
router.put('/updateGroup',checkClientSessionAndPermissionToAdmin, UserInfoController.updateGroup.bind(UserInfoController));
router.put('/updateSession',checkClientSessionAndPermissionToAdmin, UserInfoController.updateSession.bind(UserInfoController));
router.put('/updatePersonalInstractor',checkClientSessionAndPermissionToAdmin, UserInfoController.updatePersonalInstractor.bind(UserInfoController));
router.put('/updateIdsTrainersInGroup',checkClientSessionAndPermissionToAdmin, UserInfoController.updateIdsTrainersInGroup.bind(UserInfoController));
router.put('/updateIdsInstractorsInGroup',checkClientSessionAndPermissionToAdmin, UserInfoController.updateIdsInstractorsInGroup.bind(UserInfoController));

router.delete('/deleteTrainer',checkClientSessionAndPermissionToAdmin, UserInfoController.deleteOnlyTrainer.bind(UserInfoController));
router.delete('/deletePersonalInstractorAfterDeleteTrainer',checkClientSessionAndPermissionToAdmin ,UserInfoController.deletePersonalInstractorAfterDeleteTrainer.bind(UserInfoController));
router.delete('/deleteInstractor',checkClientSessionAndPermissionToAdmin, UserInfoController.deleteInstractor.bind(UserInfoController));
router.delete('/deleteTheGroup',checkClientSessionAndPermissionToAdmin, UserInfoController.deleteTheGroup.bind(UserInfoController));
router.delete('/deleteSpesificTrainerFromGroup',checkClientSessionAndPermissionToAdmin, UserInfoController.deleteSpesificTrainerFromGroup.bind(UserInfoController));
router.delete('/deleteSession',checkClientSessionAndPermissionToAdmin, UserInfoController.deleteSession.bind(UserInfoController));
router.delete('/deleteSpesificSilabusFromSession',checkClientSessionAndPermissionToAdmin, UserInfoController.deleteSpesificSilabusFromSession.bind(UserInfoController));

export default router;