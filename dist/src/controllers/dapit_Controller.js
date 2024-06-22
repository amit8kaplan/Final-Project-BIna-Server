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
const dapit_model_1 = __importDefault(require("../models/dapit_model"));
const base_controller_1 = require("./base_controller");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../common/utils");
const utils_2 = require("../common/utils");
const base = process.env.URL;
const utils_3 = require("../common/utils");
class dapit_Controller extends base_controller_1.BaseController {
    constructor() {
        super(dapit_model_1.default);
    }
    //THIS RUN GREAT!
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("get all dapit - get controller");
            try {
                const obj = yield this.model.find();
                res.status(200).send(obj);
            }
            catch (error) {
                //console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("getByFilter - get controller");
            // Initialize filter as an empty array
            let filters = (0, utils_2.filterExists)(req, utils_2.professionalFields);
            //console.log("filters in getByFilter: " + JSON.stringify(filters));
            // Initialize filter object
            const filterObject = {};
            // Populate filter object based on query logic
            if (req.query.logic === "and") {
                filterObject.$and = filters;
            }
            else if (req.query.logic === "or") {
                //console.log("or logic");
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
                //console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getCSVfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("getCSVfile - get controller");
            try {
                const data = yield this.model.find();
                const bool = (0, utils_3.toCSVFile)(data, "csv/allCSV.csv");
                if (bool)
                    res.status(200).send({ message: 'CSV file created successfully' });
                else
                    res.status(500).send({ message: 'Error creating CSV file' });
            }
            catch (error) {
                //console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getCSVfiletrainerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                //console.log("getCSVfiletrainerId: " + trainerId);
                const data = yield this.model.find({ idTrainer: trainerId });
                const name = data[0].nameTrainer;
                //console.log("name: " + name);
                const bool = (0, utils_3.toCSVFile)(data, "csv/" + name + "1.csv");
                if (bool)
                    res.status(200).send({ message: 'CSV file created successfully' });
                else
                    res.status(500).send({ message: 'Error creating CSV file' });
            }
            catch (error) {
                //console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    getDocumentbyFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("getDocumentbyFilter - get controller");
            try {
                const query = req.query;
                //console.log(" getDocumentbyFilter query: " + JSON.stringify(query));
                let data;
                let fileName;
                if (Object.keys(query).length === 0) {
                    data = yield this.model.find();
                    fileName = "all.json";
                }
                else {
                    //console.log("in the else getDocumentbyFilter query: ");
                    data = yield this.model.find(query);
                    //console.log("data: " + JSON.stringify(data));
                    fileName = data[0]._id + ".json";
                }
                if (data.length === 0) {
                    res.status(404).send({ message: 'No documents found' });
                }
                const filepath = "json/" + fileName;
                const success = yield (0, utils_1.toJSONFile)(data, filepath);
                if (success) {
                    res.status(200).send({ message: 'JSON file created successfully', filepath });
                }
                else {
                    res.status(500).send({ message: 'Error creating JSON file' });
                }
            }
            catch (error) {
                //console.error('Error fetching data:', error);
                res.status(500).send({ message: 'Error fetching data' });
            }
        });
    }
    getByFilterBasicInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {}; // Initialize filter object as an empty object
            //console.log("getByFilterBasicInfo - get controller");
            //console.log("Logic: " + req.query.tagsLogic)
            // Get filter conditions from different filter functions
            filter = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (0, utils_2.filterPartOf)(req, ['advantage', 'disavantage', 'nameInstractor', 'namePersonalInstractor', 'nameTrainer', 'group', 'idPersonalInstractor', 'idInstractor', 'idTrainer', 'session', 'summerize'])), (0, utils_2.filterByDate)(req)), (0, utils_2.filterParseInt)(req, ['silabus', 'finalGrade', 'changeTobeCommender'])), (0, utils_2.filterByProfessionalFieldsTospesificData)(req, ['identification', 'payload', 'decryption', 'workingMethod', 'understandingTheAir', 'flight', 'theortical', 'thinkingInAir', 'safety', 'briefing', 'debriefing', 'debriefingInAir', 'implementationExecise', 'dealingWithFailures', 'dealingWithStress', 'makingDecisions', 'pilotNautre', 'crewMember'])), (0, utils_2.filterByTags)(req, req.query.tagsLogic));
            //console.log("filer in controller: " + JSON.stringify(filter, null, 2));
            if (req.query.date) {
                filter["date"] = new Date(req.query.date);
            }
            try {
                const obj = yield this.model.find(filter);
                res.status(200).send(obj);
            }
            catch (error) {
                //console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("post - post controller");
            try {
                const obj = new this.model(req.body);
                yield obj.save();
                res.status(200).send(obj);
            }
            catch (error) {
                //console.error('Error creating dapit:', error);
                res.status(500).send({ message: 'Error creating dapit' });
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("put by id - put controller");
            try {
                const obj = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.status(200).send(obj);
            }
            catch (error) {
                //console.error('Error updating dapit:', error);
                res.status(500).send({ message: 'Error updating dapit' });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("delete by id - delete controller");
            //console.log("id" + req.params.id);
            try {
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).send({ message: 'Deleted successfully', deletedId: req.params.id });
            }
            catch (error) {
                //console.error('Error deleting dapit:', error);
                res.status(500).send({ message: 'Error deleting dapit' });
            }
        });
    }
    getSementically(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gradingCategories = [
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
            console.log("getSementically - get controller");
            console.log("id: " + req.params.id);
            try {
                const transformedObj = {
                    text: [], // initialize empty text array
                };
                const idDapit = req.params.id;
                const obj = yield this.model.find({ _id: idDapit });
                for (const category of gradingCategories) {
                    console.log("category: " + category);
                    // console.log("obj[0][category]: " + obj[0][category])
                    // console.log("obj[0][category].description: " + obj[0][category][0].description)
                    if (obj[0][category] && obj[0][category].length > 0 && obj[0][category][0].description) {
                        transformedObj.text.push(`${category}: ${obj[0][category][0].description}`);
                    }
                }
                if (obj[0].summerize && obj[0].summerize.length > 0) {
                    transformedObj.text.push("summary: " + obj[0].summerize);
                }
                const labelSums = {};
                const flaskres = yield axios_1.default.post('http://127.0.0.1:5000/sentimental', transformedObj);
                console.log("flaskres: " + JSON.stringify(flaskres.data));
                console.log("transformedObj: " + JSON.stringify(transformedObj));
                console.log("obj: " + JSON.stringify(obj));
                console.log("flaskres.data.length: " + flaskres.data.length);
                for (let i = 0; i < flaskres.data.length - 1; i++) {
                    console.log("inside the loop");
                    console.log("flaskres.data[i].scores: " + JSON.stringify(flaskres.data[i].scores));
                    const scores = flaskres.data[i];
                    for (const score of scores) {
                        labelSums[score.label] = (labelSums[score.label] || 0) + score.score;
                    }
                }
                console.log("flaskres.data[flaskres.data.length-1].scores: " + JSON.stringify(flaskres.data[flaskres.data.length - 1].scores));
                const scoreLast = flaskres.data[flaskres.data.length - 1];
                for (const score of scoreLast) {
                    console.log("inside the last one");
                    labelSums[score.label] = (labelSums[score.label] || 0) + score.score * 1.2;
                }
                console.log("labelSums: " + JSON.stringify(labelSums));
                res.status(200).send(labelSums);
            }
            catch (error) {
                // console.error('Error fetching dapit:', error);
                res.status(500).send({ message: 'Error fetching dapit' });
            }
        });
    }
}
exports.default = new dapit_Controller;
//# sourceMappingURL=dapit_Controller.js.map