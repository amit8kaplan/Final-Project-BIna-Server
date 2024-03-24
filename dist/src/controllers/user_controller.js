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
            let prevuser;
            try {
                console.log("deletePhotoOfUser");
                prevuser = yield user_model_1.default.findById(req.user._id);
                console.log("prevuser.imgUrl: ", prevuser.imgUrl);
                if (prevuser.imgUrl === "") {
                    console.log("the user has no photo inside the if");
                    res.status(500).json({ message: "the user has no photo" });
                }
                const user = yield user_model_1.default.findByIdAndUpdate(req.user._id, { imgUrl: "" });
                res.status(200).send(user);
            }
            catch (err) {
                console.log("the user have error in deletePhotoOfUser");
                res.status(500);
            }
        });
    }
    postPhotoOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_model_1.default.findByIdAndUpdate(req.user._id, { imgUrl: base + req.file.path });
                res.status(200).send({ url: base + req.file.path });
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.query.name || req.query.email || req.query.imgUrl || req.query.user_name) {
                let filter;
                if (req.query.name)
                    filter = { name: req.query.name };
                if (req.query.email)
                    filter = { email: req.query.email };
                if (req.query.imgUrl)
                    filter = { imgUrl: req.query.imgUrl };
                if (req.query.user_name)
                    filter = { user_name: req.query.user_name };
                const obj = yield this.model.find(filter);
                res.status(200).send(obj);
            }
            else {
                const obj = yield this.model.find();
                res.status(200).send(obj);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = yield this.model.findById(req.user._id);
                const resUser = {
                    email: obj.email,
                    imgUrl: obj.imgUrl,
                    user_name: obj.user_name,
                    password: obj.user_name
                };
                res.send(resUser);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findByIdAndUpdate(req.user._id, req.body, { new: true });
                res.status(200).json(user);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user_controller.js.map