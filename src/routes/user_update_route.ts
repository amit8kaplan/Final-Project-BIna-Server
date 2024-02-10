import express from "express";
const router = express.Router();
import authMiddleware from "../common/auth_middleware";
import UserController from "../controllers/user_controller";
import {upload_img} from "../common/file_upload";


// get all users
router.get('/', authMiddleware, UserController.get.bind(UserController));
// get user by id
router.get('/:id', authMiddleware, UserController.getById.bind(UserController));
//change the user's data - canot upload new photo only change the url of the photo and all the data
router.put('/:id', authMiddleware, UserController.putById.bind(UserController));
//the codes to change photo of user
router.post('/', authMiddleware , upload_img.single("file"), UserController.postPhotoOfUser.bind(UserController));
router.delete('/', authMiddleware, UserController.deletePhotoOfUser.bind(UserController));

export = router;
