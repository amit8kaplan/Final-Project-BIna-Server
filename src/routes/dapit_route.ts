import express from 'express';
const router = express.Router();
import dapit_Controller from '../controllers/dapit_Controller';

import { checkClientSessionAndPermissionToAdmin,checkClientSessionAndPermissionToRegular } from "../controllers/auth_new_controller";

router.get('/', dapit_Controller.get.bind(dapit_Controller));
router.get('/getByFilterBasicInfo', dapit_Controller.getByFilterBasicInfo.bind(dapit_Controller));
router.get('/getCSVfile', dapit_Controller.getCSVfile.bind(dapit_Controller));
router.get('/getCSVfile/:trainerId', dapit_Controller.getCSVfiletrainerId.bind(dapit_Controller));
router.get('/getDocumentbyFilter', dapit_Controller.getDocumentbyFilter.bind(dapit_Controller));
router.get('/getSementically/:id', dapit_Controller.getSementically.bind(dapit_Controller));
router.get('/getByFilter', dapit_Controller.getByFilter.bind(dapit_Controller));
router.get('/getDapitById', dapit_Controller.getById.bind(dapit_Controller));
router.post('/postRegular',checkClientSessionAndPermissionToRegular ,  dapit_Controller.post.bind(dapit_Controller));
router.post('/postAdmin',checkClientSessionAndPermissionToAdmin ,  dapit_Controller.post.bind(dapit_Controller));

//changeOnBasedCriteria is a function i use in client??

router.put('/ChangeOnBasedCriteria',checkClientSessionAndPermissionToRegular , dapit_Controller.ChangeOnBasedCriteria.bind(dapit_Controller));
router.put('/ChangeRegularData/:id',checkClientSessionAndPermissionToRegular, dapit_Controller.putById.bind(dapit_Controller));
router.put('/ChangeAdminData/:id',checkClientSessionAndPermissionToAdmin, dapit_Controller.putById.bind(dapit_Controller));


router.delete ('/deleteAllDapitWithTrainerId',checkClientSessionAndPermissionToAdmin, dapit_Controller.deleteAllDapitWithTrainerId.bind(dapit_Controller));
// router.delete ('/deleteAllDapitBasedOnCriteria', dapit_Controller.deleteAllDapitBasedOnCriteria.bind(dapit_Controller));
router.delete ('deleteAllDapitsOfGroup',checkClientSessionAndPermissionToAdmin, dapit_Controller.deleteAllDapitsOfGroup.bind(dapit_Controller));
router.delete('/deleteAll',checkClientSessionAndPermissionToAdmin, dapit_Controller.deleteAll.bind(dapit_Controller));
router.delete('/deleteDapitRegular/:id',checkClientSessionAndPermissionToRegular, dapit_Controller.deleteDapitById.bind(dapit_Controller));
router.delete('/deleteDapitAdmin/:id',checkClientSessionAndPermissionToAdmin, dapit_Controller.deleteDapitById.bind(dapit_Controller));

router.get('/getIDsBaseOnTrainerAndInstractorName', dapit_Controller.getIDsBaseOnTrainerAndInstractorName.bind(dapit_Controller));
export default router;