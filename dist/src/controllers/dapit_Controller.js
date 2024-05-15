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
// import { IDapitReview } from "../models/dapit_review_model";
const base = process.env.URL;
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
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
    getByTagsANDLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by tags - get controller");
            let filter = {};
            if (req.query.tags) {
                filter["tags"] = { $all: req.query.tags };
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
    getByFilterOrLogic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by filter - get controller");
            let filter = {};
            if (req.query.has_identfication) {
                filter["identfication"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_payload) {
                filter["payload"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_decryption) {
                filter["decryption"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_workingMethod) {
                filter["workingMethod"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_understandingTheAir) {
                filter["understandingTheAir"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_flight) {
                filter["flight"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_theortical) {
                filter["theortical"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_thinkingInAir) {
                filter["thinkingInAir"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_safety) {
                filter["safety"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_briefing) {
                filter["briefing"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_debriefing) {
                filter["debriefing"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_debriefingInAir) {
                filter["debriefingInAir"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_implementationExecise) {
                filter["implementationExecise"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_dealingWithFailures) {
                filter["dealingWithFailures"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_dealingWithStress) {
                filter["dealingWithStress"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_makingDecisions) {
                filter["makingDecisions"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_pilotNautre) {
                filter["pilotNautre"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
            }
            if (req.query.has_crewMember) {
                filter["crewMember"] = { $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
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
    //THIS RUN GREAT!!
    getByFilterBasicInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by filter to basic Info - get controller");
            let filter = {};
            if (req.query.nameInstractor) {
                const escapedNameInstractor = escapeRegExp(req.query.nameInstractor);
                filter["nameInstractor"] = { $regex: new RegExp(escapedNameInstractor, 'i') };
            }
            if (req.query.namePersonalInstractor) {
                const escapedNamePersonalInstractor = escapeRegExp(req.query.namePersonalInstractor);
                filter["namePersonalInstractor"] = { $regex: new RegExp(escapedNamePersonalInstractor, 'i') };
            }
            if (req.query.nameTrainer) {
                const escapedNameTrainer = escapeRegExp(req.query.nameTrainer);
                filter["nameTrainer"] = { $regex: new RegExp(escapedNameTrainer, 'i') };
            }
            if (req.query.group) {
                const escapedGroup = escapeRegExp(req.query.group);
                filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
            }
            if (req.query.idPersonalInstractor) {
                const escapedIdPersonalInstractor = escapeRegExp(req.query.idPersonalInstractor);
                filter["idPersonalInstractor"] = { $regex: new RegExp(escapedIdPersonalInstractor, 'i') };
            }
            if (req.query.idInstractor) {
                const escapedIdInstractor = escapeRegExp(req.query.idInstractor);
                filter["idInstractor"] = { $regex: new RegExp(escapedIdInstractor, 'i') };
            }
            if (req.query.idTrainer) {
                const escapedIdTrainer = escapeRegExp(req.query.idTrainer);
                filter["idTrainer"] = { $regex: new RegExp(escapedIdTrainer, 'i') };
            }
            if (req.query.session) {
                const escapedSession = escapeRegExp(req.query.session);
                filter["session"] = { $regex: new RegExp(escapedSession, 'i') };
            }
            if (req.query.startDate && req.query.endDate) {
                const startDate = new Date(req.query.startDate);
                const endDate = new Date(req.query.endDate);
                filter["date"] = { $gte: startDate, $lt: endDate };
            }
            if (req.query.silabus) {
                filter["silabus"] = parseInt(req.query.silabus);
            }
            if (req.query.date) {
                filter["date"] = new Date(req.query.date);
            }
            if (req.query.identficationVal) {
                filter["identfication.value"] = [parseInt(req.query.identficationVal)];
            }
            if (req.query.identficationDescription) {
                const escapedIdentficationDescription = escapeRegExp(req.query.identficationDescription);
                filter["identfication.description"] = { $regex: new RegExp(escapedIdentficationDescription, 'i') };
            }
            if (req.query.payloadVal) {
                filter["payload.value"] = [parseInt(req.query.payloadVal)];
            }
            if (req.query.payloadDescription) {
                const escapedPayloadDescription = escapeRegExp(req.query.payloadDescription);
                filter["payload.description"] = { $regex: new RegExp(escapedPayloadDescription, 'i') };
            }
            if (req.query.decryptionVal) {
                filter["decryption.value"] = [parseInt(req.query.decryptionVal)];
            }
            if (req.query.decryptionDescription) {
                const escapedDecryptionDescription = escapeRegExp(req.query.decryptionDescription);
                filter["decryption.description"] = { $regex: new RegExp(escapedDecryptionDescription, 'i') };
            }
            if (req.query.workingMethodVal) {
                filter["workingMethod.value"] = [parseInt(req.query.workingMethodVal)];
            }
            if (req.query.workingMethodDescription) {
                const escapedWorkingMethodDescription = escapeRegExp(req.query.workingMethodDescription);
                filter["workingMethod.description"] = { $regex: new RegExp(escapedWorkingMethodDescription, 'i') };
            }
            if (req.query.understandingTheAirVal) {
                filter["understandingTheAir.value"] = [parseInt(req.query.understandingTheAirVal)];
            }
            if (req.query.understandingTheAirDescription) {
                const escapedUnderstandingTheAirDescription = escapeRegExp(req.query.understandingTheAirDescription);
                filter["understandingTheAir.description"] = { $regex: new RegExp(escapedUnderstandingTheAirDescription, 'i') };
            }
            if (req.query.flightVal) {
                filter["flight.value"] = [parseInt(req.query.flightVal)];
            }
            if (req.query.flightDescription) {
                const escapedFlightDescription = escapeRegExp(req.query.flightDescription);
                filter["flight.description"] = { $regex: new RegExp(escapedFlightDescription, 'i') };
            }
            if (req.query.theorticalVal) {
                filter["theortical.value"] = [parseInt(req.query.theorticalVal)];
            }
            if (req.query.theorticalDescription) {
                const escapedTheorticalDescription = escapeRegExp(req.query.theorticalDescription);
                filter["theortical.description"] = { $regex: new RegExp(escapedTheorticalDescription, 'i') };
            }
            if (req.query.thinkingInAirVal) {
                filter["thinkingInAir.value"] = [parseInt(req.query.thinkingInAirVal)];
            }
            if (req.query.thinkingInAirDescription) {
                const escapedThinkingInAirDescription = escapeRegExp(req.query.thinkingInAirDescription);
                filter["thinkingInAir.description"] = { $regex: new RegExp(escapedThinkingInAirDescription, 'i') };
            }
            if (req.query.safetyVal) {
                filter["safety.value"] = [parseInt(req.query.safetyVal)];
            }
            if (req.query.safetyDescription) {
                const escapedSafetyDescription = escapeRegExp(req.query.safetyDescription);
                filter["safety.description"] = { $regex: new RegExp(escapedSafetyDescription, 'i') };
            }
            if (req.query.briefingVal) {
                filter["briefing.value"] = [parseInt(req.query.briefingVal)];
            }
            if (req.query.briefingDescription) {
                const escapedBriefingDescription = escapeRegExp(req.query.briefingDescription);
                filter["briefing.description"] = { $regex: new RegExp(escapedBriefingDescription, 'i') };
            }
            if (req.query.debriefingVal) {
                filter["debriefing.value"] = [parseInt(req.query.debriefingVal)];
            }
            if (req.query.debriefingDescription) {
                const escapedDebriefingDescription = escapeRegExp(req.query.debriefingDescription);
                filter["debriefing.description"] = { $regex: new RegExp(escapedDebriefingDescription, 'i') };
            }
            if (req.query.debriefingInAirVal) {
                filter["debriefingInAir.value"] = [parseInt(req.query.debriefingInAirVal)];
            }
            if (req.query.debriefingInAirDescription) {
                const escapedDebriefingInAirDescription = escapeRegExp(req.query.debriefingInAirDescription);
                filter["debriefingInAir.description"] = { $regex: new RegExp(escapedDebriefingInAirDescription, 'i') };
            }
            if (req.query.implementationExeciseVal) {
                filter["implementationExecise.value"] = [parseInt(req.query.implementationExeciseVal)];
            }
            if (req.query.implementationExeciseDescription) {
                const escapedImplementationExeciseDescription = escapeRegExp(req.query.implementationExeciseDescription);
                filter["implementationExecise.description"] = { $regex: new RegExp(escapedImplementationExeciseDescription, 'i') };
            }
            if (req.query.dealingWithFailuresVal) {
                filter["dealingWithFailures.value"] = [parseInt(req.query.dealingWithFailuresVal)];
            }
            if (req.query.dealingWithFailuresDescription) {
                const escapedDealingWithFailuresDescription = escapeRegExp(req.query.dealingWithFailuresDescription);
                filter["dealingWithFailures.description"] = { $regex: new RegExp(escapedDealingWithFailuresDescription, 'i') };
            }
            if (req.query.dealingWithStressVal) {
                filter["dealingWithStress.value"] = [parseInt(req.query.dealingWithStressVal)];
            }
            if (req.query.dealingWithStressDescription) {
                const escapedDealingWithStressDescription = escapeRegExp(req.query.dealingWithStressDescription);
                filter["dealingWithStress.description"] = { $regex: new RegExp(escapedDealingWithStressDescription, 'i') };
            }
            if (req.query.makingDecisionsVal) {
                filter["makingDecisions.value"] = [parseInt(req.query.makingDecisionsVal)];
            }
            if (req.query.makingDecisionsDescription) {
                const escapedMakingDecisionsDescription = escapeRegExp(req.query.makingDecisionsDescription);
                filter["makingDecisions.description"] = { $regex: new RegExp(escapedMakingDecisionsDescription, 'i') };
            }
            if (req.query.pilotNautreVal) {
                filter["pilotNautre.value"] = [parseInt(req.query.pilotNautreVal)];
            }
            if (req.query.pilotNautreDescription) {
                const escapedPilotNautreDescription = escapeRegExp(req.query.pilotNautreDescription);
                filter["pilotNautre.description"] = { $regex: new RegExp(escapedPilotNautreDescription, 'i') };
            }
            if (req.query.crewMemberVal) {
                filter["crewMember.value"] = [parseInt(req.query.crewMemberVal)];
            }
            if (req.query.crewMemberDescription) {
                filter["crewMember.description"] = { $regex: new RegExp(escapeRegExp(req.query.crewMemberDescription), 'i') };
            }
            if (req.query.advantage) {
                filter["advantage"] = { $in: [req.query.advantage] };
            }
            if (req.query.disavantage) {
                filter["disavantage"] = req.query.disavantage;
            }
            if (req.query.tags) {
                if (req.query.tagsOrLogic == "1") {
                    console.log("tagsOrLogic");
                    filter["tags"] = { $in: req.query.tags };
                }
                else if (req.query.tagsAndLogic == "1") {
                    console.log("tagsAndLogic");
                    filter["tags"] = { $all: req.query.tags };
                }
            }
            if (req.query.changeTobeCommender) {
                filter["changeTobeCommender"] = req.query.changeTobeCommender;
            }
            if (req.query.finalGrade) {
                filter["finalGrade"] = req.query.finalGrade;
            }
            if (req.query.summerize) {
                const escapedSummerize = escapeRegExp(req.query.summerize);
                filter["summerize"] = { $regex: new RegExp(escapedSummerize, 'i') };
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
}
exports.default = new dapit_Controller;
//# sourceMappingURL=dapit_Controller.js.map