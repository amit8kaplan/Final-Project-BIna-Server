"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.decCountInCourseName = exports.incCountInCourseName = exports.extractUserName = exports.toJSONFile = exports.toCSVFile = exports.filterPartOf = exports.filterByTags = exports.filterStringUsingIn = exports.filterParseInt = exports.filterByProfessionalFieldsTospesificData = exports.filterByDate = exports.filterExists = exports.finalFields = exports.professionalFieldsHas = exports.professionalFields = exports.escapeRegExp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
const fc = __importStar(require("fast-csv"));
const fs_1 = __importDefault(require("fs"));
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
exports.professionalFields = [
    'identification', 'payload', 'decryption', 'workingMethod',
    'understandingTheAir', 'flight', 'theoretical', 'thinkingInAir',
    'safety', 'briefing', 'debriefing', 'debriefingInAir',
    'implementationExecise', 'dealingWithFailures', 'dealingWithStress',
    'makingDecisions', 'pilotNature', 'crewMember'
];
exports.professionalFieldsHas = [
    'has_identification', 'has_payload', 'has_decryption', 'has_workingMethod',
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
function toCSVFile(data, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (fs_1.default.existsSync(path)) {
                fs_1.default.unlinkSync(path);
                console.log("file deleted");
            }
            const csvStream = fc.format({ headers: true });
            const writableStream = fs_1.default.createWriteStream(path);
            csvStream.pipe(writableStream).on('end', () => {
                console.log("end");
            });
            data.forEach((doc) => {
                const filteredDoc = Object.assign({}, doc.toJSON());
                delete filteredDoc._id;
                // Handle nested objects:
                const nestedObjectKeys = [
                    "identification",
                    "payload",
                    "decryption",
                    "workingMethod",
                    "understandingTheAir",
                    "flight",
                    "theoretical",
                    "thinkingInAir",
                    "safety",
                    "briefing",
                    "debriefing",
                    "debriefingInAir",
                    "implementationExecise",
                    "dealingWithFailures",
                    "dealingWithStress",
                    "makingDecisions",
                    "pilotNature",
                    "crewMember",
                ];
                for (const key of nestedObjectKeys) {
                    if (filteredDoc[key]) {
                        for (const item of filteredDoc[key]) {
                            for (const subKey in item) {
                                if (subKey !== "_id")
                                    filteredDoc[`${key}.${subKey}`] = item[subKey];
                            }
                        }
                        delete filteredDoc[key];
                    }
                }
                csvStream.write(filteredDoc);
            });
            csvStream.end();
            return true;
        }
        catch (error) {
            console.error('Error fetching dapit:', error);
            return false;
        }
    });
}
exports.toCSVFile = toCSVFile;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// Function to save data to a JSON file
function toJSONFile(data, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Ensure the directory exists
            const directoryPath = path_1.default.dirname(filePath);
            if (!fs_1.default.existsSync(directoryPath)) {
                yield promises_1.default.mkdir(directoryPath, { recursive: true });
            }
            // Delete the file if it exists
            if (fs_1.default.existsSync(filePath)) {
                yield promises_1.default.unlink(filePath);
                console.log("File deleted");
            }
            // Write data to JSON file
            const jsonData = JSON.stringify(data, null, 2);
            yield promises_1.default.writeFile(filePath, jsonData, 'utf-8');
            console.log(`Data written to JSON file: ${filePath}`);
            return true;
        }
        catch (error) {
            console.error('Error writing to JSON file:', error);
            return false;
        }
    });
}
exports.toJSONFile = toJSONFile;
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