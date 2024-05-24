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
const dapit_model_1 = __importDefault(require("../models/dapit_model"));
const base_controller_1 = require("./base_controller");
const utils_1 = require("../common/utils");
const fs = __importStar(require("fs"));
const fc = __importStar(require("fast-csv"));
const base = process.env.URL;
class dapit_Controller extends base_controller_1.BaseController {
    constructor() {
        super(dapit_model_1.default);
    }
    //THIS RUN GREAT!
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get all dapit - get controller");
            try {
                const obj = yield this.model.find();
                res.status(200).send(obj);
            }
            catch (error) {
                console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getByFilter - get controller");
            // Initialize filter as an empty array
            let filters = (0, utils_1.filterExists)(req, utils_1.professionalFields);
            console.log("filters in getByFilter: " + JSON.stringify(filters));
            // Initialize filter object
            const filterObject = {};
            // Populate filter object based on query logic
            if (req.query.logic === "and") {
                filterObject.$and = filters;
            }
            else if (req.query.logic === "or") {
                console.log("or logic");
                filterObject.$or = filters;
            }
            else {
                return res.status(400).send({ message: 'Invalid query logic' });
            }
            try {
                const obj = yield this.model.find(filterObject);
                res.status(200).send(obj);
            }
            catch (error) {
                console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getCSVfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                console.log("getCSVfiletrainerId: " + trainerId);
                const data = yield this.model.find({ idTrainer: trainerId });
                const csvStream = fc.format({ headers: true });
                const writableStream = fs.createWriteStream("csv/" + data[0].nameTrainer + ".csv");
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
                res.status(200).send({ message: 'CSV file created successfully' });
            }
            catch (error) {
                console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getByFilterBasicInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {}; // Initialize filter object as an empty object
            console.log("getByFilterBasicInfo - get controller");
            console.log("Logic: " + req.query.tagsLogic);
            // Get filter conditions from different filter functions
            filter = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (0, utils_1.filterPartOf)(req, ['advantage', 'disavantage', 'nameInstractor', 'namePersonalInstractor', 'nameTrainer', 'group', 'idPersonalInstractor', 'idInstractor', 'idTrainer', 'session', 'summerize'])), (0, utils_1.filterByDate)(req)), (0, utils_1.filterParseInt)(req, ['silabus', 'finalGrade', 'changeTobeCommender'])), (0, utils_1.filterByProfessionalFieldsTospesificData)(req, ['identification', 'payload', 'decryption', 'workingMethod', 'understandingTheAir', 'flight', 'theortical', 'thinkingInAir', 'safety', 'briefing', 'debriefing', 'debriefingInAir', 'implementationExecise', 'dealingWithFailures', 'dealingWithStress', 'makingDecisions', 'pilotNautre', 'crewMember'])), (0, utils_1.filterByTags)(req, req.query.tagsLogic));
            console.log("filer in controller: " + JSON.stringify(filter, null, 2));
            if (req.query.date) {
                filter["date"] = new Date(req.query.date);
            }
            try {
                const obj = yield this.model.find(filter);
                res.status(200).send(obj);
            }
            catch (error) {
                console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post - post controller");
            try {
                const obj = new this.model(req.body);
                yield obj.save();
                res.status(200).send(obj);
            }
            catch (error) {
                console.error('Error creating dapit:', error);
                res.status(500).send({ message: 'Error creating dapit' });
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("put by id - put controller");
            try {
                const obj = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.status(200).send(obj);
            }
            catch (error) {
                console.error('Error updating dapit:', error);
                res.status(500).send({ message: 'Error updating dapit' });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("delete by id - delete controller");
            console.log("id" + req.params.id);
            try {
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).send({ message: 'Deleted successfully', deletedId: req.params.id });
            }
            catch (error) {
                console.error('Error deleting dapit:', error);
                res.status(500).send({ message: 'Error deleting dapit' });
            }
        });
    }
}
exports.default = new dapit_Controller;
//# sourceMappingURL=dapit_Controller.js.map