"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const base_controller_1 = require("./base_controller");
const base = process.env.URL;
class UserController extends base_controller_1.BaseController {
    constructor() {
        super(user_model_1.default);
    }
    deletePhotoOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deletePhotoOfUser:" + req.user._id);
            try {
                const user = yield user_model_1.default.findByIdAndUpdate(req.user._id, { imgUrl: "" });
                // user.imgUrl = "";
                // await user.save();
                res.status(200).send(user);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    postPhotoOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("router.post(/file: " + base + req.file.path);
            res.status(200).send({ url: base + req.file.path });
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user_controller.js.map