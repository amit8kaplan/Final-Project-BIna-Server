"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const file_upload_1 = require("../common/file_upload");
// get all users
router.get('/', auth_middleware_1.default, user_controller_1.default.get.bind(user_controller_1.default));
// get user by id
router.get('/:id', auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
//change the user's data - canot upload new photo only change the url of the photo and all the data
router.put('/:id', auth_middleware_1.default, user_controller_1.default.putById.bind(user_controller_1.default));
//the codes to change photo of user
router.post('/', auth_middleware_1.default, file_upload_1.upload.single("file"), user_controller_1.default.postPhotoOfUser.bind(user_controller_1.default));
router.delete('/', auth_middleware_1.default, user_controller_1.default.deletePhotoOfUser.bind(user_controller_1.default));
module.exports = router;
//# sourceMappingURL=user_update_route.js.map