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
const course_model_1 = __importDefault(require("../models/course_model"));
const base_controller_1 = require("./base_controller");
const utils_1 = require("../common/utils");
const courses_reviews_model_1 = __importDefault(require("../models/courses_reviews_model"));
const base = process.env.URL;
const fs_1 = __importDefault(require("fs"));
class course_controller extends base_controller_1.BaseController {
    constructor() {
        super(course_model_1.default);
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            ////////console.log("newCourse:" + req.body);
            const _id = req.user._id;
            try {
                (0, utils_1.extractUserName)(_id).then((result) => {
                    ////////console.log("the user name:" + result);
                    req.body.owner_name = result;
                    req.body.Count = 0;
                    req.body.owner = _id;
                    _super.post.call(this, req, res);
                });
            }
            catch (err) {
                ////////console.log("problem with find the user of the builder of the course" +err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    postVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            ////////console.log("newVideo:" + base + req.file.path);
            try {
                res.status(200).send({ url: base + req.file.path });
            }
            catch (err) {
                ////////console.log(err);
                res.status(500).json({ message: err.message, url: base + req.file.path });
            }
        });
    }
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            ////////console.log("getByUserId:" + req.params.id);
            try {
                const obj = yield course_model_1.default.find({ owner: req.params.id });
                ////////console.log("obj to getByUserId:" + obj);
                res.status(200).send(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    putById(req, res) {
        const _super = Object.create(null, {
            putById: { get: () => super.putById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const oldCourse = yield course_model_1.default.findById(req.params.id);
            //////console.log("Request body:", JSON.stringify(req.body, null, 2));
            //////console.log("oldCourse:", JSON.stringify(oldCourse, null, 2));
            if (oldCourse.owner == req.user._id
                && oldCourse.owner_name == req.body.owner_name
                && oldCourse.id == req.body._id) {
                _super.putById.call(this, req, res);
            }
            else {
                res.status(403).json({ message: "you are not allowed to change this course" });
            }
        });
    }
    deleteById(req, res) {
        const _super = Object.create(null, {
            deleteById: { get: () => super.deleteById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            //////console.log("deleteById:" + req.params.id);
            //////console.log("req body:", JSON.stringify(req.body, null, 2));
            //////console.log("req user:", JSON.stringify(req.user, null, 2));
            //////console.log("req params:", JSON.stringify(req.params, null, 2));
            //////console.log("req query:", JSON.stringify(req.query, null, 2));
            req.query = { course_id: req.params.id };
            //////console.log("req query after change:" + JSON.stringify(req.query, null, 2));
            yield courses_reviews_model_1.default.deleteMany({ course_id: req.params.id }).then((result) => {
                //////console.log("result" + result);
            });
            let prevuser;
            try {
                prevuser = yield course_model_1.default.findById(req.params.id);
                console.log("prevuser" + JSON.stringify(prevuser, null, 2));
                if (prevuser.videoUrl === "") {
                    res.status(500).json({ message: "the course has no vid" });
                }
                fs_1.default.unlinkSync("./" + prevuser.videoUrl);
                _super.deleteById.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new course_controller;
//# sourceMappingURL=course_controller.js.map