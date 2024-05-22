import dapit_model, {IDapit} from "../models/dapit_model";
import { BaseController } from "./base_controller";
import e, { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName} from "../common/utils";
import { FilterQuery } from "mongoose";
import { filterExists,filterPartOf ,filterByTags, filterByProfessionalFieldsTospesificData, filterParseInt, filterStringUsingIn, filterByDate ,escapeRegExp , professionalFields, professionalFieldsHas, finalFields} from "../common/utils";
import exp from "constants";
// import { IDapitReview } from "../models/dapit_review_model";
const base = process.env.URL;

// function escapeRegExp(string) {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
// }
class dapit_Controller extends BaseController<IDapit>{
    constructor() {
        super(dapit_model)
    }
    //THIS RUN GREAT!
    async get (req: Request, res: Response) {
        console.log("get all dapit - get controller");
        try {
            const obj = await this.model.find();
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getByFilter(req: Request, res: Response) {
        console.log("getByFilter - get controller");
    
        // Initialize filter as an empty array
        let filters: any[] = filterExists(req, professionalFields);
    
        console.log("filters in getByFilter: " + JSON.stringify(filters));
    
        // Initialize filter object
        const filterObject: any = {};
    
        // Populate filter object based on query logic
        if (req.query.logic === "and") {
            filterObject.$and = filters;
        } else if (req.query.logic === "or") {
            console.log("or logic");
            filterObject.$or = filters;
        } else {
            return res.status(400).send({ message: 'Invalid query logic' });
        }
    
        try {
            const obj = await this.model.find(filterObject);
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    
    // async getByFilterBasicInfo (req: Request, res: Response)
    // {
    //     console.log("get by filter to basic Info - get controller");
    //     let filter: FilterQuery<IDapit> = {};
    //     if (req.query.nameInstractor){
    //         const escapedNameInstractor = escapeRegExp(req.query.nameInstractor as string);
    //         filter["nameInstractor"] = { $regex: new RegExp(escapedNameInstractor, 'i') };
    //     }
    //     if (req.query.namePersonalInstractor){
    //         const escapedNamePersonalInstractor = escapeRegExp(req.query.namePersonalInstractor as string);
    //         filter["namePersonalInstractor"] = { $regex: new RegExp(escapedNamePersonalInstractor, 'i') };
    //     }
    //     if (req.query.nameTrainer){
    //         const escapedNameTrainer = escapeRegExp(req.query.nameTrainer as string);
    //         filter["nameTrainer"] = { $regex: new RegExp(escapedNameTrainer, 'i') };
    //     }
    //     if (req.query.group){
    //         const escapedGroup = escapeRegExp(req.query.group as string);
    //         filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
    //     }
    //     if (req.query.idPersonalInstractor){
    //         const escapedIdPersonalInstractor = escapeRegExp(req.query.idPersonalInstractor as string);
    //         filter["idPersonalInstractor"] = { $regex: new RegExp(escapedIdPersonalInstractor, 'i') };
    //     }
    //     if (req.query.idInstractor){
    //         const escapedIdInstractor = escapeRegExp(req.query.idInstractor as string);
    //         filter["idInstractor"] = { $regex: new RegExp(escapedIdInstractor, 'i') };
    //     }
    //     if (req.query.idTrainer){
    //         const escapedIdTrainer = escapeRegExp(req.query.idTrainer as string);
    //         filter["idTrainer"] = { $regex: new RegExp(escapedIdTrainer, 'i') };
    //     }
    //     if (req.query.session){
    //         const escapedSession = escapeRegExp(req.query.session as string);
    //         filter["session"] = { $regex: new RegExp(escapedSession, 'i') };
    //     }
    //     if (req.query.startDate && req.query.endDate){
    //         const startDate = new Date(req.query.startDate as string);
    //         const endDate = new Date(req.query.endDate as string);
    //         filter["date"] = { $gte: startDate, $lt: endDate };
    //     }
    //     if (req.query.silabus){
    //         filter["silabus"] = parseInt(req.query.silabus as string);
    //     }
    //     if (req.query.date){
    //         filter["date"] = new Date(req.query.date as string);
    //     }
    //     if (req.query.identficationVal){
    //         filter["identfication.value"] = [parseInt(req.query.identficationVal as string)];
    //     }
    //     if(req.query.identficationDescription){
    //         const escapedIdentficationDescription = escapeRegExp(req.query.identficationDescription as string);
    //         filter["identfication.description"] = { $regex: new RegExp(escapedIdentficationDescription, 'i') };
    //     }
    //     if (req.query.payloadVal){
    //         filter["payload.value"] = [parseInt(req.query.payloadVal as string)];
    //     }
    //     if(req.query.payloadDescription){
    //         const escapedPayloadDescription = escapeRegExp(req.query.payloadDescription as string);
    //         filter["payload.description"] = { $regex: new RegExp(escapedPayloadDescription, 'i') };
    //     }
    //     if (req.query.decryptionVal){
    //         filter["decryption.value"] = [parseInt(req.query.decryptionVal as string)];
    //     }
    //     if(req.query.decryptionDescription){
    //         const escapedDecryptionDescription = escapeRegExp(req.query.decryptionDescription as string);
    //         filter["decryption.description"] = { $regex: new RegExp(escapedDecryptionDescription, 'i') };
    //     }
    //     if (req.query.workingMethodVal){
    //         filter["workingMethod.value"] = [parseInt(req.query.workingMethodVal as string)];
    //     }
    //     if(req.query.workingMethodDescription){
    //         const escapedWorkingMethodDescription = escapeRegExp(req.query.workingMethodDescription as string);
    //         filter["workingMethod.description"] = { $regex: new RegExp(escapedWorkingMethodDescription, 'i') };
    //     }
    //     if (req.query.understandingTheAirVal){
    //         filter["understandingTheAir.value"] = [parseInt(req.query.understandingTheAirVal as string)];
    //     }
    //     if(req.query.understandingTheAirDescription){
    //         const escapedUnderstandingTheAirDescription = escapeRegExp(req.query.understandingTheAirDescription as string);
    //         filter["understandingTheAir.description"] = { $regex: new RegExp(escapedUnderstandingTheAirDescription, 'i') };
    //     }
    //     if (req.query.flightVal){
    //         filter["flight.value"] = [parseInt(req.query.flightVal as string)];
    //     }
    //     if(req.query.flightDescription){
    //         const escapedFlightDescription = escapeRegExp(req.query.flightDescription as string);
    //         filter["flight.description"] = { $regex: new RegExp(escapedFlightDescription, 'i') };
    //     }
    //     if (req.query.theorticalVal){
    //         filter["theortical.value"] = [parseInt(req.query.theorticalVal as string)];
    //     }
    //     if(req.query.theorticalDescription){
    //         const escapedTheorticalDescription = escapeRegExp(req.query.theorticalDescription as string);
    //         filter["theortical.description"] = { $regex: new RegExp(escapedTheorticalDescription, 'i') };
    //     }
    //     if (req.query.thinkingInAirVal){
    //         filter["thinkingInAir.value"] = [parseInt(req.query.thinkingInAirVal as string)];
    //     }
    //     if(req.query.thinkingInAirDescription){
    //         const escapedThinkingInAirDescription = escapeRegExp(req.query.thinkingInAirDescription as string);
    //         filter["thinkingInAir.description"] = { $regex: new RegExp(escapedThinkingInAirDescription, 'i') };
    //     }
    //     if (req.query.safetyVal){
    //         filter["safety.value"] = [parseInt(req.query.safetyVal as string)];
    //     }
    //     if(req.query.safetyDescription){
    //         const escapedSafetyDescription = escapeRegExp(req.query.safetyDescription as string);
    //         filter["safety.description"] = { $regex: new RegExp(escapedSafetyDescription, 'i') };
    //     }
    //     if (req.query.briefingVal){
    //         filter["briefing.value"] = [parseInt(req.query.briefingVal as string)];
    //     }
    //     if(req.query.briefingDescription){
    //         const escapedBriefingDescription = escapeRegExp(req.query.briefingDescription as string);
    //         filter["briefing.description"] = { $regex: new RegExp(escapedBriefingDescription, 'i') };
    //     }
    //     if (req.query.debriefingVal){
    //         filter["debriefing.value"] = [parseInt(req.query.debriefingVal as string)];
    //     }
    //     if(req.query.debriefingDescription){
    //         const escapedDebriefingDescription = escapeRegExp(req.query.debriefingDescription as string);
    //         filter["debriefing.description"] = { $regex: new RegExp(escapedDebriefingDescription, 'i') };
    //     }
    //     if (req.query.debriefingInAirVal){
    //         filter["debriefingInAir.value"] = [parseInt(req.query.debriefingInAirVal as string)];
    //     }
    //     if(req.query.debriefingInAirDescription){
    //         const escapedDebriefingInAirDescription = escapeRegExp(req.query.debriefingInAirDescription as string);
    //         filter["debriefingInAir.description"] = { $regex: new RegExp(escapedDebriefingInAirDescription, 'i') };
    //     }
    //     if (req.query.implementationExeciseVal){
    //         filter["implementationExecise.value"] = [parseInt(req.query.implementationExeciseVal as string)];
    //     }
    //     if(req.query.implementationExeciseDescription){
    //         const escapedImplementationExeciseDescription = escapeRegExp(req.query.implementationExeciseDescription as string);
    //         filter["implementationExecise.description"] = { $regex: new RegExp(escapedImplementationExeciseDescription, 'i') };
    //     }
    //     if (req.query.dealingWithFailuresVal){
    //         filter["dealingWithFailures.value"] = [parseInt(req.query.dealingWithFailuresVal as string)];
    //     }
    //     if(req.query.dealingWithFailuresDescription){
    //         const escapedDealingWithFailuresDescription = escapeRegExp(req.query.dealingWithFailuresDescription as string);
    //         filter["dealingWithFailures.description"] = { $regex: new RegExp(escapedDealingWithFailuresDescription, 'i') };
    //     }
    //     if (req.query.dealingWithStressVal){
    //         filter["dealingWithStress.value"] = [parseInt(req.query.dealingWithStressVal as string)];
    //     }
    //     if(req.query.dealingWithStressDescription){
    //         const escapedDealingWithStressDescription = escapeRegExp(req.query.dealingWithStressDescription as string);
    //         filter["dealingWithStress.description"] = { $regex: new RegExp(escapedDealingWithStressDescription, 'i') };
    //     }
    //     if (req.query.makingDecisionsVal){
    //         filter["makingDecisions.value"] = [parseInt(req.query.makingDecisionsVal as string)];
    //     }
    //     if(req.query.makingDecisionsDescription){
    //         const escapedMakingDecisionsDescription = escapeRegExp(req.query.makingDecisionsDescription as string);
    //         filter["makingDecisions.description"] = { $regex: new RegExp(escapedMakingDecisionsDescription, 'i') };
    //     }
    //     if (req.query.pilotNautreVal){
    //         filter["pilotNautre.value"] = [parseInt(req.query.pilotNautreVal as string)];
    //     }
    //     if(req.query.pilotNautreDescription){
    //         const escapedPilotNautreDescription = escapeRegExp(req.query.pilotNautreDescription as string);
    //         filter["pilotNautre.description"] = { $regex: new RegExp(escapedPilotNautreDescription, 'i') };
    //     }
    //     if (req.query.crewMemberVal){
    //         filter["crewMember.value"] = [parseInt(req.query.crewMemberVal as string)];
    //     }
    //     if (req.query.crewMemberDescription){
    //         filter["crewMember.description"] = { $regex: new RegExp(escapeRegExp(req.query.crewMemberDescription as string), 'i') };
    //     }
    //     if (req.query.advantage) {
    //         filter["advantage"] = { $in: [req.query.advantage] };
    //     }
    //     if (req.query.disavantage) {
    //         filter["disavantage"] = req.query.disavantage as string[];
    //     }
    //     if (req.query.tags){
    //         if (req.query.tagsOrLogic as string == "1"){ 
    //             console.log("tagsOrLogic");
    //         filter["tags"] = { $in: req.query.tags as string[] };
    //         }
    //         else if (req.query.tagsAndLogic as string == "1"){
    //             console.log("tagsAndLogic");
    //             filter["tags"] = { $all: req.query.tags as string[] };
    //         }
    //     }
    //     if (req.query.changeTobeCommender){
    //         filter["changeTobeCommender"] = req.query.changeTobeCommender as string;
    //     }
    //     if (req.query.finalGrade)
    //     {
    //         filter["finalGrade"] = req.query.finalGrade as string;
    //     }
    //     if (req.query.summerize)
    //         {
    //             const escapedSummerize = escapeRegExp(req.query.summerize as string);
    //             filter["summerize"] = { $regex: new RegExp(escapedSummerize, 'i') };
    //         }

    //     console.log("filer in controller: " + JSON.stringify(filter, null, 2));
    //     try{
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     }
    //     catch (error) {
    //         console.error('Error fetching dapit:', error);
    //         res.status(500).send({ message: 'Error fetching dapit' });
    //     }
    // }
    //THIS RUN GREAT!!
    // async getByFilterBasicInfo (req: Request, res: Response)
    // {
    //     let filter: any[] = [];
    //     filter = filterPartOf(req,
    //         ['nameInstractor', 'namePersonalInstractor', 'nameTrainer',
    //          'group', 'idPersonalInstractor', 'idInstractor', 'idTrainer', 'session',
    //         , 'summerize']); 
    //     filter.push(...filterByDate(req));
    //     filter.push(...filterParseInt(req, ['silabus','finalGrade', 'changeTobeCommender']));
    //     filter.push(...filterByProfessionalFieldsTospesificData(req,
    //          ['identfication', 'payload', 'decryption', 'workingMethod', 'understandingTheAir', 
    //          'flight', 'theortical', 'thinkingInAir', 'safety','briefing',
    //           'debriefing', 'debriefingInAir', 'implementationExecise',
    //            'dealingWithFailures', 'dealingWithStress', 'makingDecisions',
    //             'pilotNautre', 'crewMember']));
    //     try{
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     }
    //     catch (error) {
    //         console.error('Error fetching dapit:', error);
    //         res.status(500).send({ message: 'Error fetching dapit' });
    //     }
    // }
    // async getByFilterBasicInfo(req: Request, res: Response) {
    //     let filter: any = {}; // Initialize filter object as an empty object
    
    //     // Get filter conditions from different filter functions
    //     filter = filterPartOf(req, ['nameInstractor', 'namePersonalInstractor', 'nameTrainer', 'group', 'idPersonalInstractor', 'idInstractor', 'idTrainer', 'session', 'summerize']);
    //     filter.push(...filterByDate(req));
    //     filter.push(...filterParseInt(req, ['silabus', 'finalGrade', 'changeTobeCommender']));
    //     filter.push(...filterByProfessionalFieldsTospesificData(req, ['identfication', 'payload', 'decryption', 'workingMethod', 'understandingTheAir', 'flight', 'theortical', 'thinkingInAir', 'safety', 'briefing', 'debriefing', 'debriefingInAir', 'implementationExecise', 'dealingWithFailures', 'dealingWithStress', 'makingDecisions', 'pilotNautre', 'crewMember']));
        
    //     try {
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     } catch (error) {
    //         console.error('Error fetching dapit:', error);
    //         res.status(500).send({ message: 'Error fetching dapit' });
    //     }
        
    // }
    async getByFilterBasicInfo(req: Request, res: Response) {
        let filter = {}; // Initialize filter object as an empty object
        console.log("getByFilterBasicInfo - get controller");
        console.log("Logic: " + req.query.tagsLogic)
        // Get filter conditions from different filter functions
        filter = {
            ...filterPartOf(req, ['advantage', 'disavantage', 'nameInstractor', 'namePersonalInstractor', 'nameTrainer', 'group', 'idPersonalInstractor', 'idInstractor', 'idTrainer', 'session', 'summerize']), // Spread operator
            ...filterByDate(req),
            ...filterParseInt(req, ['silabus', 'finalGrade', 'changeTobeCommender']),
            ...filterByProfessionalFieldsTospesificData(req, ['identfication', 'payload', 'decryption', 'workingMethod', 'understandingTheAir', 'flight', 'theortical', 'thinkingInAir', 'safety', 'briefing', 'debriefing', 'debriefingInAir', 'implementationExecise', 'dealingWithFailures', 'dealingWithStress', 'makingDecisions', 'pilotNautre', 'crewMember']),
            //its alyaws need to be a tagsOrLogic
            ...filterByTags(req, req.query.tagsLogic as string)
        
        };
        console.log("filer in controller: " + JSON.stringify(filter, null, 2));
        if (req.query.date){
            filter["date"] = new Date(req.query.date as string);
        }      
        try {
          const obj = await this.model.find(filter);
          res.status(200).send(obj);
        } catch (error) {
          console.error('Error fetching dapit:', error);
          res.status(500).send({ message: 'Error fetching dapit' });
        }
      }
      
    

    async post (req: Request, res: Response) {
        console.log("post Dapit controller");
        try {
            const obj = new this.model(req.body);
            await obj.save();
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error creating dapit:', error);
            res.status(500).send({ message: 'Error creating dapit' });
        }
    }

    async putById (req: Request, res: Response) {
        console.log("put by id - put controller");
        try {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error updating dapit:', error);
            res.status(500).send({ message: 'Error updating dapit' });
        }
    }
    async deleteById (req: Request, res: Response) {
        console.log("delete by id - delete controller");
        console.log("id" + req.params.id);
        try {
            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).send({ message: 'Deleted successfully' , deletedId: req.params.id});
        } catch (error) {
            console.error('Error deleting dapit:', error);
            res.status(500).send({ message: 'Error deleting dapit' });
        }
    }   
   
}

export default new dapit_Controller;