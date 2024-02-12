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
exports.decCountInCourseName = exports.incCountInCourseName = exports.extractUserName = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
function extractUserName(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("the user id:" + id);
        const objId = new mongoose_1.default.Types.ObjectId(id);
        console.log("the user objId:" + objId);
        try {
            const userModel = yield user_model_1.default.findById(objId);
            if (!userModel) {
                return { message: "User not found" };
            }
            else {
                console.log("the user name in utils:" + userModel.user_name);
                return userModel.user_name;
            }
        }
        catch (err) {
            console.log("problem with find the user of the builder of the course" + err);
            return { message: err.message };
        }
    });
}
exports.extractUserName = extractUserName;
function incCountInCourseName(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("the course id:" + id);
        const objId = new mongoose_1.default.Types.ObjectId(id);
        console.log("the course objId:" + objId);
        try {
            const courseModel = yield course_model_1.default.findOneAndUpdate({ _id: objId }, { $inc: { Count: 1 } }, { new: true });
            if (!courseModel) {
                return { message: "Course not found" };
            }
            else {
                console.log("the count in the utils:" + courseModel.Count);
                return courseModel.Count;
            }
        }
        catch (err) {
            console.log("problem with find the course the buileder the reviews" + err);
            return { message: err.message };
        }
    });
}
exports.incCountInCourseName = incCountInCourseName;
function decCountInCourseName(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("the course id:" + id);
        const objId = new mongoose_1.default.Types.ObjectId(id);
        console.log("the course objId:" + objId);
        try {
            const courseModel = yield course_model_1.default.findOneAndUpdate({ _id: objId }, { $inc: { Count: -1 }, $min: { Count: 0 } }, { new: true });
            if (!courseModel) {
                return { message: "Course not found or Count<0" };
            }
            else {
                console.log("the count in the utils:" + courseModel.Count);
                return courseModel.Count;
            }
        }
        catch (err) {
            console.log("problem with find the course the buileder the reviews" + err);
            return { message: err.message };
        }
    });
}
exports.decCountInCourseName = decCountInCourseName;
//# sourceMappingURL=utils.js.map