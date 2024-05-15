import dapit_model, {IDapit} from "../models/dapit_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import {extractUserName} from "../common/utils";
import { FilterQuery } from "mongoose";
import exp from "constants";
// import { IDapitReview } from "../models/dapit_review_model";
const base = process.env.URL;

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
class dapit_Controller extends BaseController<IDapit>{
    constructor() {
        super(dapit_model)
    }
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
    async getByTagsORLogic (req: Request, res: Response) {
        console.log("get by tags - get controller");
        let filter: FilterQuery<IDapit> = {};
        if (req.query.tags) {
            filter["tags"] = { $in: req.query.tags as string[] };
        }
        try {
            const obj = await this.model.find(filter);
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getByTagsANDLogic (req: Request, res: Response) {
        console.log("get by tags - get controller");
        let filter: FilterQuery<IDapit> = {};
        if (req.query.tags) {
            filter["tags"] = { $all: req.query.tags as string[] };
        }
        try {
            const obj = await this.model.find(filter);
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getByFilterOrLogic (req: Request, res: Response) {
        console.log("get by filter - get controller");
        let filter: FilterQuery<IDapit> = {};
        if(req.query.has_identfication){
            filter["identfication"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_payload){
            filter["payload"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_decryption){
            filter["decryption"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_workingMethod){
            filter["workingMethod"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_understandingTheAir){
            filter["understandingTheAir"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_flight){
            filter["flight"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_theortical){
            filter["theortical"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_thinkingInAir){
            filter["thinkingInAir"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_safety){
            filter["safety"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_briefing){
            filter["briefing"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_debriefing){
            filter["debriefing"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_debriefingInAir){
            filter["debriefingInAir"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_implementationExecise){
            filter["implementationExecise"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_dealingWithFailures){
            filter["dealingWithFailures"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_dealingWithStress){
            filter["dealingWithStress"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_makingDecisions){
            filter["makingDecisions"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_pilotNautre){
            filter["pilotNautre"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        if (req.query.has_crewMember){
            filter["crewMember"] ={ $regex: /[0-9]/ }; // Check if there is at least one digit in the first element of the tuple
        }
        try {
            const obj = await this.model.find(filter);
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error fetching dapit:', error);
            res.status(500).send({ message: 'Error fetching dapit' });
        }
    }
    async getByFilterBasicInfo (req: Request, res: Response)
    {
        console.log("get by filter to basic Info - get controller");
        let filter: FilterQuery<IDapit> = {};
        if (req.query.nameInstractor){
            const escapedNameInstractor = escapeRegExp(req.query.nameInstractor as string);
            filter["nameInstractor"] = { $regex: new RegExp(escapedNameInstractor, 'i') };
        }
        if (req.query.namePersonalInstractor){
            const escapedNamePersonalInstractor = escapeRegExp(req.query.namePersonalInstractor as string);
            filter["namePersonalInstractor"] = { $regex: new RegExp(escapedNamePersonalInstractor, 'i') };
        }
        if (req.query.nameTrainer){
            const escapedNameTrainer = escapeRegExp(req.query.nameTrainer as string);
            filter["nameTrainer"] = { $regex: new RegExp(escapedNameTrainer, 'i') };
        }
        if (req.query.group){
            const escapedGroup = escapeRegExp(req.query.group as string);
            filter["group"] = { $regex: new RegExp(escapedGroup, 'i') };
        }
        if (req.query.idPersonalInstractor){
            const escapedIdPersonalInstractor = escapeRegExp(req.query.idPersonalInstractor as string);
            filter["idPersonalInstractor"] = { $regex: new RegExp(escapedIdPersonalInstractor, 'i') };
        }
        if (req.query.idInstractor){
            const escapedIdInstractor = escapeRegExp(req.query.idInstractor as string);
            filter["idInstractor"] = { $regex: new RegExp(escapedIdInstractor, 'i') };
        }
        if (req.query.idTrainer){
            const escapedIdTrainer = escapeRegExp(req.query.idTrainer as string);
            filter["idTrainer"] = { $regex: new RegExp(escapedIdTrainer, 'i') };
        }
        if (req.query.session){
            const escapedSession = escapeRegExp(req.query.session as string);
            filter["session"] = { $regex: new RegExp(escapedSession, 'i') };
        }
        // if (req.query.startDate && req.query.endDate){
        //     const startDate = new Date(req.query.startDate as string);
        //     const endDate = new Date(req.query.endDate as string);
        //     filter["date"] = { $gte: startDate, $lt: endDate };
        // }
        if (req.query.silabus){
            filter["silabus"] = parseInt(req.query.silabus as string);
        }
        if (req.query.date){
            filter["date"] = new Date(req.query.date as string);
        }
        if (req.query.crewMemberVal){
            filter["crewMember.value"] = [parseInt(req.query.crewMemberVal as string)];
        }
        if (req.query.crewMemberDescription){
            console.log("crewMemberDescription", req.query.crewMemberDescription);
            filter["crewMember.description"] = { $regex: new RegExp(escapeRegExp(req.query.crewMemberDescription as string), 'i') };
            console.log("filter", filter);
        }
        if (req.query.advantage) {
            filter["advantage"] = { $in: [req.query.advantage] };
        }
        if (req.query.disavantage) {
            filter["disavantage"] = req.query.disavantage as string[];
        }
        if (req.query.tags){
            filter["tags"] = { $in: req.query.tags as string[] };
        }
        if (req.query.changeTobeCommender){
            filter["changeTobeCommender"] = req.query.changeTobeCommender as string;
        }
        if (req.query.finalGrade)
        {
            filter["finalGrade"] = req.query.finalGrade as string;
        }
        if (req.query.summerize)
            {
                const escapedSummerize = escapeRegExp(req.query.summerize as string);
                filter["summerize"] = { $regex: new RegExp(escapedSummerize, 'i') };
            }
        try{
            const obj = await this.model.find(filter);
            res.status(200).send(obj);
        }
        catch (error) {
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
    //     // if (req.query.startDate && req.query.endDate){
    //     //     const startDate = new Date(req.query.startDate as string);
    //     //     const endDate = new Date(req.query.endDate as string);
    //     //     filter["date"] = { $gte: startDate, $lt: endDate };
    //     // }
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
    //         filter["identfication.1"] = [req.query.identficationDescription as string];
    //     }

    //     if (req.query.identfication){
    //         filter["identfication.0"] = [parseInt(req.query.identfication as string)];
    //         filter["identfication.1"] = [req.query.identfication as string];
    //     }
    //     if (req.query.payload){
    //         filter["payload.0"] = [parseInt(req.query.payload as string)];
    //         filter["payload.1"] = [req.query.payload as string];
    //     }
    //     if (req.query.decryption){
    //         filter["decryption.0"] = [parseInt(req.query.decryption as string)];
    //         filter["decryption.1"] = [req.query.decryption as string];
    //     }
    //     if (req.query.workingMethod){
    //         filter["workingMethod.0"] = [parseInt(req.query.workingMethod as string)];
    //         filter["workingMethod.1"] = [req.query.workingMethod as string];
    //     }
    //     if (req.query.understandingTheAir){
    //         filter["understandingTheAir.0"] = [parseInt(req.query.understandingTheAir as string)];
    //         filter["understandingTheAir.1"] = [req.query.understandingTheAir as string];
    //     }
    //     if (req.query.flight){
    //         filter["flight.0"] = [parseInt(req.query.flight as string)];
    //         filter["flight.1"] = [req.query.flight as string];
    //     }
    //     if (req.query.theortical){
    //         filter["theortical.0"] = [parseInt(req.query.theortical as string)];
    //         filter["theortical.1"] = [req.query.theortical as string];
    //     }
    //     if (req.query.thinkingInAir){
    //         filter["thinkingInAir.0"] = [parseInt(req.query.thinkingInAir as string)];
    //         filter["thinkingInAir.1"] = [req.query.thinkingInAir as string];
    //     }
    //     if (req.query.safety){
    //         filter["safety.0"] = [parseInt(req.query.safety as string)];
    //         filter["safety.1"] = [req.query.safety as string];
    //     }
    //     if (req.query.briefing){
    //         filter["briefing.0"] = [parseInt(req.query.briefing as string)];
    //         filter["briefing.1"] = [req.query.briefing as string];
    //     }
    //     if (req.query.debriefing){
    //         filter["debriefing.0"] = [parseInt(req.query.debriefing as string)];
    //         filter["debriefing.1"] = [req.query.debriefing as string];
    //     }
    //     if (req.query.debriefingInAir){
    //         filter["debriefingInAir.0"] = [parseInt(req.query.debriefingInAir as string)];
    //         filter["debriefingInAir.1"] = [req.query.debriefingInAir as string];
    //     }
    //     if (req.query.implementationExecise){
    //         filter["implementationExecise.0"] = [parseInt(req.query.implementationExecise as string)];
    //         filter["implementationExecise.1"] = [req.query.implementationExecise as string];
    //     }
    //     if (req.query.dealingWithFailures){
    //         filter["dealingWithFailures.0"] = [parseInt(req.query.dealingWithFailures as string)];
    //         filter["dealingWithFailures.1"] = [req.query.dealingWithFailures as string];
    //     }
    //     if (req.query.dealingWithStress){
    //         filter["dealingWithStress.0"] = [parseInt(req.query.dealingWithStress as string)];
    //         filter["dealingWithStress.1"] = [req.query.dealingWithStress as string];
    //     }
    //     if (req.query.makingDecisions){
    //         filter["makingDecisions.0"] = [parseInt(req.query.makingDecisions as string)];
    //         filter["makingDecisions.1"] = [req.query.makingDecisions as string];
    //     }
    //     if (req.query.pilotNautre){
    //         filter["pilotNautre.0"] = [parseInt(req.query.pilotNautre as string)];
    //         filter["pilotNautre.1"] = [req.query.pilotNautre as string];
    //     }
    //     if (req.query.crewMemberVal){
    //         filter["crewMember.0"] = [parseInt(req.query.crewMemberVal as string)];
    //     }
    //     if (req.query.crewMemberDescription){
    //         filter["crewMember.1"] = [req.query.crewMember as string];
    //     }
    //     if (req.query.advantage) {
    //         filter["advantage"] = { $in: [req.query.advantage] };
    //     }
    //     if (req.query.disavantage) {
    //         filter["disavantage"] = req.query.disavantage as string[];
    //     }
    //     if (req.query.tags){
    //         filter["tags"] = { $in: req.query.tags as string[] };
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
    //     try{
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     }
    //     catch (error) {
    //         console.error('Error fetching dapit:', error);
    //         res.status(500).send({ message: 'Error fetching dapit' });
    //     }
    // }

    async post (req: Request, res: Response) {
        console.log("post - post controller");
        try {
            const obj = new this.model(req.body);
            await obj.save();
            res.status(200).send(obj);
        } catch (error) {
            console.error('Error creating dapit:', error);
            res.status(500).send({ message: 'Error creating dapit' });
        }
    }
    // async getByUserName (req: Request, res: Response) {
    //     console.log("get by user name - get controller");
    //     let filter: FilterQuery<IDapit> = {};
    //     if (req.query.userName) {
    //         const escapedUserName = escapeRegExp(req.query.userName as string);
    //         filter["userName"] = { $regex: new RegExp(escapedUserName, 'i') };
    //     }
    //     try {
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     } catch (error) {
    //         console.error('Error fetching dapit:', error);
    //         res.status(500).send({ message: 'Error fetching dapit' });
    //     }
    // }
    // async getBySession (req: Request, res: Response) {
    //     console.log("get by session - get controller");
    //     let filter: FilterQuery<IDapit> = {};
    //     if (req.query.session) {
    //         const escapedSession = escapeRegExp(req.query.session as string);
    //         filter["session"] = { $regex: new RegExp(escapedSession, 'i') };
    //     }
    //     try {
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     } catch (error) {
    //         console.error('Error fetching dapit:', error);
    //         res.status(500).send({ message: 'Error fetching dapit' });
    //     }
    // }
        // async get(req: Request, res: Response) {
    //     console.log("query", req.query);
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
    //     if (req.query.silabus){
    //         filter["silabus"] = parseInt(req.query.silabus as string);
    //     }
    //     if (req.query.startDate && req.query.endDate){
    //         const startDate = new Date(req.query.startDate as string);
    //         const endDate = new Date(req.query.endDate as string);
    //         filter["date"] = { $gte: startDate, $lt: endDate };
    //     }
    //     if (req.query.id) {
    //         filter["_id"] = req.query.id as string;
    //     }
    //     if (req.query.identfication) {
    //         filter["identfication"] = req.query.identfication as string;
    //     }
    //     if (req.query.payload) {
    //         filter["payload"] = req.query.payload as string;
    //     }
    //     if (req.query.decryption) {
    //         filter["decryption"] = req.query.decryption as string;
    //     }
    //     if (req.query.workingMethod) {
    //         filter["workingMethod"] = req.query.workingMethod as string;
    //     }
    //     if (req.query.understandingTheAir) {
    //         filter["understandingTheAir"] = req.query.understandingTheAir as string;
    //     }
    //     if (req.query.flight) {
    //         filter["flight"] = req.query.flight as string;
    //     }
    //     if (req.query.theortical) {
    //         filter["theortical"] = req.query.theortical as string;
    //     }
    //     if (req.query.thinkingInAir) {
    //         filter["thinkingInAir"] = req.query.thinkingInAir as string;
    //     }
    //     if (req.query.safety) {
    //         filter["safety"] = req.query.safety as string;
    //     }
    //     if (req.query.briefing) {
    //         filter["briefing"] = req.query.briefing as string;
    //     }
    //     if (req.query.debriefing) {
    //         filter["debriefing"] = req.query.debriefing as string;
    //     }
    //     if (req.query.debriefingInAir){  
    //         filter["debriefingInAir"] = req.query.debriefingInAir as string;
    //     }

    //     try {
    //         const obj = await this.model.find(filter);
    //         res.status(200).send(obj);
    //     } catch (error) {
    //         console.error('Error fetching courses:', error);
    //         res.status(500).send({ message: 'Error fetching courses' });
    //     }// }
}

export default new dapit_Controller;