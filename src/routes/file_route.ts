import express from "express";
const router = express.Router();
import multer from "multer";
import authMiddleware from "../common/auth_middleware";
import UserController from "../controllers/user_controller";
// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });


router.post('/', authMiddleware , upload.single("file"), UserController.postPhotoOfUser.bind(UserController));
router.delete('/', authMiddleware, UserController.deletePhotoOfUser.bind(UserController));

export = router;
