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
// export function filterExists(req: Request, filterFields: string[]) {
//     const filters: any[] = [];
//     filterFields.forEach((field) => {
//         if (req.query["has_" + field]) {
//             filters.push({ [field + ".value"]: { $exists: true } });
//         }
//     });
//     return filters;
// }
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
// export function filterByDate(req: Request) {
//     const filter: any = [];
//     if (req.query.startDate && req.query.endDate) {
//         filter.push({
//                 date: {
//                     $gte: new Date(req.query.startDate as string),
//                     $lte: new Date(req.query.endDate as string) }
//         });
//     }
//     return filter;
// }
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
// export function filterByProfessionalFieldsTospesificData(req: Request, filterFields: string[]) {
//     const filter: any = [];
//     filterFields.forEach((field) => {
//         if (req.query[field+"Val"]) {
//             filter.push({ [field + ".value"]: parseInt (req.query[field] as string) });
//         }
//         if (req.query[field+"Description"]) {
//             const escaped = escapeRegExp(req.query[field+"Description"] as string);
//             filter.push({ [field + ".description"]: { $regex: new RegExp(escaped, 'i') } });
//         }
//     });
//     return filter;
// }
// export function filterParseInt(req: Request, filterFields: string[]) {
//     const filter: any = [];
//     filterFields.forEach((field) => {
//         if (req.query[field]) {
//             filter.push({ [field]: parseInt(req.query[field] as string) });
//         }
//     });
//     return filter;
// }
// export function filterStringUsingIn(req: Request, filterFields: string[]) {
//     const filter: any = [];
//     filterFields.forEach((field) => {
//         if (req.query[field]) {
//             filter.push({ [field]:  { $in: [req.query[field]] } });
//         }
//     });
//     return filter;
// }
// export function filterByTags (req: Request, Logic: string) {
//     const filter: any = [];
//     if (req.query.tags) {
//         if (Logic === "and") {
//             filter.push({ tags: { $all: req.query.tags as string } });
//         }
//         else {
//             filter.push({ tags: { $in: req.query.tags as string } });
//         }
//         const tags = req.query.tags as string[];
//         filter.push({ tags: { $in: tags } });
//     }
//     return filter;
// }
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
// export function filterPartOf(req: Request, filterFields: string[]) {
//     const filter: any = []; // Initialize filter object as an empty object
//     //console.log("req.query if func: ", JSON.stringify(req.query, null, 2));
//     filterFields.forEach((field) => {
//         //console.log("field: ", field);
//         //console.log("req.query[field]: before if ", req.query[field]);
//         if (req.query[field]) {
//             //console.log("req.query[field]: ", req.query[field]);
//             const escaped = escapeRegExp(req.query[field] as string);
//             filter[field] = { $regex: new RegExp(escaped, 'i') }; // Assign condition directly to filter object
//             //console.log("filter the adding data: ", [field, { $regex: new RegExp(escaped, 'i') }]);
//         }
//     });
//     //console.log("filter in the end of the func ", JSON.stringify(filter, null, 2));
//     return filter;
// }
// export function filterPartOf(req: Request, filterFields: string[]) {
//     const filters: any = []; // Initialize an array to store filter conditions
//     filterFields.forEach((field) => {
//         if (req.query[field]) {
//             const escaped = escapeRegExp(req.query[field] as string);
//             if (Array.isArray(req.query[field])) {
//                 const values = req.query[field] as string[];
//                 // Create a regular expression to match any value in the array
//                 const regex = values.map((value: string) => new RegExp(escapeRegExp(value), 'i'));
//                 // Use $in operator to match any value in the array
//                 filters.push({ [field]: { $in: regex } });
//             } else {
//                 // Assign condition directly to filter object
//                 filters.push({ [field]: { $regex: new RegExp(escaped, 'i') } });
//             }
//         }
//     });
//     return filters;
// }
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