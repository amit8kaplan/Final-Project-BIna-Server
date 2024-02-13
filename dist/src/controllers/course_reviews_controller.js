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
const courses_reviews_model_1 = __importDefault(require("../models/courses_reviews_model"));
const base_controller_1 = require("./base_controller");
const utils_1 = require("../common/utils");
class coursesReviewsController extends base_controller_1.BaseController {
    constructor() {
        super(courses_reviews_model_1.default);
    }
    get(req, res) {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            ////console.log("Get by query parameter:");
            ////console.log("req.query:" + JSON.stringify(req.query, null, 2));
            _super.get.call(this, req, res);
        });
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let UserObj;
            ////console.log("newReviewToCourse:" + req.body);
            req.body.owner_id = req.user._id;
            ////console.log("the user id:" + req.body.owner_id);
            try {
                yield (0, utils_1.extractUserName)(req.body.owner_id).then((result) => {
                    req.body.owner_name = result;
                    ////console.log("the user name:" + req.body.owner_name);
                });
                const course_idtoInc = req.body.course_id;
                const count = yield (0, utils_1.incCountInCourseName)(course_idtoInc);
                ////console.log("the count of the course++:" + count);
            }
            catch (err) {
                ////console.log("problem with find the user of the builder " +err);
                res.status(500).json({ message: err.message });
            }
            ////console.log("rev.title" + req.body.title);
            _super.post.call(this, req, res);
        });
    }
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            ////////console.log("get all the reviews By User Id:" + req.params.id);
            try {
                const obj = yield courses_reviews_model_1.default.find({ owner_id: req.params.id });
                ////////console.log("obj to getByUserId:" + obj);
                res.status(200).send(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        const _super = Object.create(null, {
            deleteById: { get: () => super.deleteById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            ////console.log("deleteReviewById:" + req.params.id);
            try {
                const review = yield courses_reviews_model_1.default.findById(req.params.id);
                ////console.log("the review:" + review);
                ////console.log("the review.course_id:" + review.course_id);
                const course_idtodec = review.course_id;
                const count = yield (0, utils_1.decCountInCourseName)(course_idtodec);
                ////console.log("the count of the course--:" + count);
                _super.deleteById.call(this, req, res);
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
            ////console.log("updateReviewById:" + req.params.id);
            ////console.log("req.query:" + JSON.stringify(req.query, null, 2)); 
            _super.putById.call(this, req, res);
        });
    }
}
exports.default = new coursesReviewsController();
//# sourceMappingURL=course_reviews_controller.js.map