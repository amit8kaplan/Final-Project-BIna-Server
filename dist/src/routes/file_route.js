"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.');
        cb(null, Date.now() + "." + ext);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', auth_middleware_1.default, upload.single("file"), user_controller_1.default.postPhotoOfUser.bind(user_controller_1.default));
router.delete('/', auth_middleware_1.default, user_controller_1.default.deletePhotoOfUser.bind(user_controller_1.default));
module.exports = router;
//# sourceMappingURL=file_route.js.map