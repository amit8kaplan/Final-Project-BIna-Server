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
            try {
                //console.log("get by query parameter:");
                //console.log("req.query:" + JSON.stringify(req.query, null, 2));
                if (req.query[0] !== undefined) {
                    let queryKey = Object.keys(req.query)[0]; // Get the first query parameter
                    const queryValue = req.query[queryKey]; // Get the value of the first query parameter
                    queryKey = queryKey.substring(1);
                    //console.log("queryKey:" + queryKey);
                    if (queryKey && queryValue) {
                        let filter;
                        switch (queryKey) {
                            case 'owner_id':
                            case 'course_id':
                                filter = { [queryKey]: queryValue };
                                //console.log("course_id:")
                                break;
                            // case 'course_name':
                            //     // Use regular expression for partial match
                            //     filter = { [queryKey]: { $regex: new RegExp(String(queryValue), 'i') } };
                            //     break;
                            case 'score':
                                // Check if the score in the result is greater than the client sent value
                                filter = { score: { $gte: parseInt(queryValue) } };
                                break;
                            default:
                                // Return all documents if the query key is not recognized
                                filter = {};
                                //console.log("default:")
                                break;
                        }
                        const obj = yield this.model.find(filter);
                        res.status(200).send(obj);
                    }
                }
                else {
                    // If no query parameters provided, return all documents
                    const obj = yield this.model.find();
                    res.send(obj);
                }
            }
            catch (err) {
                console.log("error", err.message);
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let UserObj;
            ////////////console.log("newReviewToCourse:" + req.body);
            req.body.owner_id = req.user._id;
            ////////////console.log("the user id:" + req.body.owner_id);
            try {
                yield (0, utils_1.extractUserName)(req.body.owner_id).then((result) => {
                    req.body.owner_name = result;
                    ////////////console.log("the user name:" + req.body.owner_name);
                });
                const course_idtoInc = req.body.course_id;
                const count = yield (0, utils_1.incCountInCourseName)(course_idtoInc);
                ////////////console.log("the count of the course++:" + count);
            }
            catch (err) {
                ////////////console.log("problem with find the user of the builder " +err);
                res.status(500).json({ message: err.message });
            }
            ////////////console.log("rev.title" + req.body.title);
            _super.post.call(this, req, res);
        });
    }
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // //console.log("get all the reviews By User Id:" + req.params.id);
            try {
                const obj = yield courses_reviews_model_1.default.find({ owner_id: req.params.id });
                // //console.log("obj to getByUserId:" + obj);
                res.status(200).send(obj);
            }
            catch (err) {
                // //console.log("error")
                res.status(500).json({ message: err.message });
            }
        });
    }
    getUsingSpesificUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("req.user._id:" + req.user._id);
            try {
                const obj = yield courses_reviews_model_1.default.find({ owner_id: req.user._id });
                //console.log("obj to getUsingSpesificUser:" + obj);
                res.status(200).send(1);
            }
            catch (err) {
                //console.log("error")
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        const _super = Object.create(null, {
            deleteById: { get: () => super.deleteById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            ////////////console.log("deleteReviewById:" + req.params.id);
            try {
                const review = yield courses_reviews_model_1.default.findById(req.params.id);
                ////////////console.log("the review:" + review);
                ////////////console.log("the review.course_id:" + review.course_id);
                const course_idtodec = review.course_id;
                const count = yield (0, utils_1.decCountInCourseName)(course_idtodec);
                ////////////console.log("the count of the course--:" + count);
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
            ////////console.log("updateReviewById:" + req.params.id);
            ////////console.log("req.body:" + JSON.stringify(req.body, null, 2));
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