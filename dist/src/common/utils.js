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
exports.decCountInCourseName = exports.incCountInCourseName = exports.extractUserName = exports.filterPartOf = exports.filterByTags = exports.filterStringUsingIn = exports.filterParseInt = exports.filterByProfessionalFieldsTospesificData = exports.filterByDate = exports.filterExists = exports.finalFields = exports.professionalFieldsHas = exports.professionalFields = exports.escapeRegExp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
exports.professionalFields = [
    'identfication', 'payload', 'decryption', 'workingMethod',
    'understandingTheAir', 'flight', 'theoretical', 'thinkingInAir',
    'safety', 'briefing', 'debriefing', 'debriefingInAir',
    'implementationExecise', 'dealingWithFailures', 'dealingWithStress',
    'makingDecisions', 'pilotNature', 'crewMember'
];
exports.professionalFieldsHas = [
    'has_identfication', 'has_payload', 'has_decryption', 'has_workingMethod',
    'has_understandingTheAir', 'has_flight', 'has_theoretical', 'has_thinkingInAir',
    'has_safety', 'has_briefing', 'has_debriefing', 'has_debriefingInAir',
    'has_implementationExecise', 'has_dealingWithFailures', 'has_dealingWithStress',
    'has_makingDecisions', 'has_pilotNature', 'has_crewMember'
];
exports.finalFields = [
    'finalGrade', 'summerize'
];
function filterExists(req, filterFields) {
    const filters = [];
    filterFields.forEach((field) => {
        if (req.query["has_" + field]) {
            filters.push({ [field + ".value"]: { $exists: true } });
        }
    });
    return filters;
}
exports.filterExists = filterExists;
function filterByDate(req) {
    const filter = {};
    if (req.query.startDate && req.query.endDate) {
        filter.date = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }
    return filter;
}
exports.filterByDate = filterByDate;
function filterByProfessionalFieldsTospesificData(req, filterFields) {
    const filter = {};
    filterFields.forEach((field) => {
        if (req.query[field + "Val"]) {
            console.log(field + "Val === crewMemberVal");
            console.log("field: ", field);
            console.log("req.query[field] in filterByProfessionalFieldsTospesificData: ", req.query[field + "Val"]);
            filter[field + ".value"] = parseInt(req.query[field + "Val"]);
        }
        if (req.query[field + "Description"]) {
            const escaped = escapeRegExp(req.query[field + "Description"]);
            filter[field + ".description"] = { $regex: new RegExp(escaped, 'i') };
        }
    });
    return filter;
}
exports.filterByProfessionalFieldsTospesificData = filterByProfessionalFieldsTospesificData;
function filterParseInt(req, filterFields) {
    const filter = {};
    filterFields.forEach((field) => {
        if (req.query[field]) {
            filter[field] = parseInt(req.query[field]);
        }
    });
    return filter;
}
exports.filterParseInt = filterParseInt;
function filterStringUsingIn(req, filterFields) {
    const filter = {};
    filterFields.forEach((field) => {
        if (req.query[field]) {
            filter[field] = { $in: [req.query[field]] };
        }
    });
    return filter;
}
exports.filterStringUsingIn = filterStringUsingIn;
function filterByTags(req, Logic) {
    const filter = {};
    if (req.query.tags) {
        if (Logic === "and") {
            console.log("in side the if and");
            filter.tags = { $all: req.query.tags };
        }
        else {
            filter.tags = { $in: req.query.tags };
        }
    }
    return filter;
}
exports.filterByTags = filterByTags;
function filterPartOf(req, filterFields) {
    const filter = {}; // Initialize filter object as an empty object
    filterFields.forEach((field) => {
        if (req.query[field]) {
            const escaped = escapeRegExp(req.query[field]);
            if (Array.isArray(req.query[field])) {
                const values = req.query[field];
                const regex = values.map((value) => new RegExp(escapeRegExp(value), 'i'));
                filter[field] = { $in: regex };
            }
            else {
                filter[field] = { $regex: new RegExp(escaped, 'i') };
            }
        }
    });
    return filter;
}
exports.filterPartOf = filterPartOf;
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