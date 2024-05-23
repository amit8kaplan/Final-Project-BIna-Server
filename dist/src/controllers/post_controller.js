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
const post_model_1 = __importDefault(require("../models/post_model"));
const base_controller_1 = require("./base_controller");
class post_controller extends base_controller_1.BaseController {
    constructor() {
        super(post_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post Post - controller");
            try {
                const body = req.body;
                const obj = yield post_model_1.default.create(body);
                console.log("obj", JSON.stringify(obj, null, 2));
                res.status(201).send(obj);
            }
            catch (err) {
                console.log("err", err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAllPosts - controller");
            try {
                const posts = yield post_model_1.default.find();
                res.status(200).json(posts);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getPostByIdtrainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getPostByIdtrainer - controller");
            try {
                const trainerId = req.params.trainerId;
                const posts = yield post_model_1.default.find({ idTrainer: trainerId });
                res.status(200).json(posts);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("put - controller");
            try {
                console.log("req.body", req.body);
                const id = req.params.id;
                const post = yield post_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
                console.log("post after update", post);
                res.status(200).json(post);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("delete - controller");
            try {
                const id = req.params.id;
                yield post_model_1.default.findByIdAndDelete(id);
                res.status(204).json();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new post_controller();
//# sourceMappingURL=post_controller.js.map