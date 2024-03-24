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
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by query parameter:");
            console.log("req.query:", JSON.stringify(req.query, null, 2));
            // Check for existence of specific query parameters
            if (req.query.course_id || req.query.owner_id || req.query.score) {
                console.log("Using query parameters");
                let filter;
                if (req.query.course_id) {
                    filter = { course_id: req.query.course_id };
                    console.log("filter:", filter);
                }
                if (req.query.owner_id) {
                    filter = { owner_id: req.query.owner_id };
                }
                if (req.query.score) {
                    filter = { score: { $gte: parseInt(req.query.score) } };
                }
                const obj = yield this.model.find(filter);
                res.status(200).send(obj);
            }
            else {
                console.log("No query parameters provided");
                // Return all documents if no query parameters are specified
                const obj = yield this.model.find();
                res.status(200).send(obj);
            }
        });
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let UserObj;
            req.body.owner_id = req.user._id;
            yield (0, utils_1.extractUserName)(req.body.owner_id).then((result) => {
                req.body.owner_name = result;
            });
            const course_idtoInc = req.body.course_id;
            const count = yield (0, utils_1.incCountInCourseName)(course_idtoInc);
            _super.post.call(this, req, res);
        });
    }
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield courses_reviews_model_1.default.find({ owner_id: req.params.id });
            res.status(200).send(obj);
        });
    }
    deleteById(req, res) {
        const _super = Object.create(null, {
            deleteById: { get: () => super.deleteById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield courses_reviews_model_1.default.findById(req.params.id);
            const course_idtodec = review.course_id;
            yield (0, utils_1.decCountInCourseName)(course_idtodec);
            _super.deleteById.call(this, req, res);
        });
    }
    putById(req, res) {
        const _super = Object.create(null, {
            putById: { get: () => super.putById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const prevReview = yield courses_reviews_model_1.default.findById(req.params.id);
            if (prevReview.course_id == req.body.course_id
                && prevReview.course_name == req.body.course_name
                && prevReview.owner_id == req.body.owner_id
                && prevReview.owner_name == req.body.owner_name
                && prevReview._id == req.body._id) {
                _super.putById.call(this, req, res);
            }
            else {
                res.status(406).send("fail: " + "You can't change the course or the owner of the review");
            }
        });
    }
}
exports.default = new coursesReviewsController();
//# sourceMappingURL=course_reviews_controller.js.map