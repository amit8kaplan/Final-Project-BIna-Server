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
        const objId = new mongoose_1.default.Types.ObjectId(id);
        const userModel = yield user_model_1.default.findById(objId);
        return userModel.user_name;
    });
}
exports.extractUserName = extractUserName;
function incCountInCourseName(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseModel = yield course_model_1.default.findOneAndUpdate({ _id: id }, { $inc: { Count: 1 } }, { new: true });
            return courseModel.Count;
        }
        catch (err) {
            return { message: err.message };
        }
    });
}
exports.incCountInCourseName = incCountInCourseName;
function decCountInCourseName(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const objId = new mongoose_1.default.Types.ObjectId(id);
        try {
            const course_obj = yield course_model_1.default.findById(objId);
            course_obj.Count = course_obj.Count - 1;
            const count = yield course_model_1.default.findByIdAndUpdate({ _id: objId }, { $set: { Count: course_obj.Count } });
            return count.Count;
        }
        catch (err) {
            return { message: err.message };
        }
    });
}
exports.decCountInCourseName = decCountInCourseName;
//# sourceMappingURL=utils.js.map