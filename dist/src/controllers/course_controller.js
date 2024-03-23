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
class course_controller extends base_controller_1.BaseController {
    constructor() {
        super(course_model_1.default);
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryKey = Object.keys(req.query)[0];
                let queryValue = req.query[queryKey];
                if (Array.isArray(queryValue)) {
                    queryValue = queryValue[0];
                }
                if (queryKey && queryValue) {
                    let filter;
                    switch (queryKey) {
                        case 'id':
                            filter = { "_id": queryValue };
                            break;
                        case 'owner_name':
                        case 'name':
                        case 'description':
                            filter = { [queryKey]: { $regex: new RegExp(queryValue, 'i') } };
                            break;
                        case 'Count':
                            filter = { Count: { $gte: parseInt(queryValue) } };
                            break;
                        default:
                            filter = {};
                            break;
                    }
                    const obj = yield this.model.find(filter);
                    res.status(200).send(obj);
                }
                else {
                    const obj = yield this.model.find();
                    res.status(200).send(obj);
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const _id = req.user._id;
            try {
                (0, utils_1.extractUserName)(_id).then((result) => {
                    req.body.owner_name = result;
                    req.body.Count = 0;
                    req.body.owner = _id;
                    _super.post.call(this, req, res);
                });
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    postVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("post vid")
            try {
                //console.log("req.file.pathL" ,req.file.path);
                res.status(200).send({ url: base + req.file.path });
            }
            catch (err) {
                res.status(500).json({ message: err.message, url: base + req.file.path });
            }
        });
    }
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = yield course_model_1.default.find({ owner: req.user._id });
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
            if (oldCourse.Count - 1 == req.body.Count
                && oldCourse.owner_name == req.body.owner_name
                && oldCourse.id == req.body._id
                && (oldCourse.description != '' || oldCourse.description == req.body.description)
                && oldCourse.name == req.body.name
                && oldCourse.videoUrl != '' || oldCourse.videoUrl == req.body.videoUrl) {
                _super.putById.call(this, req, res);
            }
            else if (oldCourse.owner == req.user._id
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
            req.query = { _id: req.params.id };
            try {
                yield courses_reviews_model_1.default.deleteMany({ course_id: req.params.id });
                const prevuser = yield course_model_1.default.findById(req.params.id);
                _super.deleteById.call(this, req, res);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new course_controller;
//# sourceMappingURL=course_controller.js.map