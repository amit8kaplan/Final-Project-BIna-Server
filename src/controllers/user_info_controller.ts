import Trainer, {ITrainer} from "../models/trainer_model";
import Instractor, {IInstractor} from "../models/Instractor_model";
import PersonalInstractor, {IPersonalInstractor} from "../models/PersonalInstractor_model";
import Group from '../models/group_model';
import Session from '../models/session_model'; 
import { BaseController } from "./base_controller";
import e, { Request, Response } from "express";
import axios from 'axios'; 
const base = process.env.URL;



class UserInfoController  {

    public async getAllPersonalInstractors(req: Request, res: Response) {
        try {
            const personalInstractorData = await PersonalInstractor.find();
            res.status(200).json(personalInstractorData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    public async 

    public async getTrainerByname(req: Request, res: Response) {
        try {
            const trainerName = req.query.trainerName;
            const trainerData = await Trainer.find({name: trainerName});
            res.status(200).json(trainerData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    public async getInstractorByname(req: Request, res: Response) {
        console.log("getInstractorByname");
        console.log(req.query);
        try {
            const instractorName = req.query.instractorName;
            const instractorData = await Instractor.find({name: instractorName});
            res.status(200).json(instractorData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    public async getTrainerById(req: Request, res: Response) {
        try {
            const trainerId = req.query.trainerId;
            const trainerData = await Trainer.findById(trainerId);
            res.status(200).json(trainerData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    public async getInstractorById(req: Request, res: Response) {
        try {
            const instractorId = req.query.instractorId;
            const instractorData = await Instractor.findById(instractorId);
            res.status(200).json(instractorData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
    public async getAllTrainers(req: Request, res: Response) {
        try {
            const trainerData = await Trainer.find();
            res.status(200).json(trainerData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
    public async getAllInstractors(req: Request, res: Response) {
        try {
            const instractorData = await Instractor.find();
            res.status(200).json(instractorData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
    public async getAllGroups(req: Request, res: Response) {
        try {
            const groupData = await Group.find();
            res.status(200).json(groupData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    public async getAllSessions(req: Request, res: Response) {
        try {
            const sessionData = await Session.find();
            res.status(200).json(sessionData);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }
/**
 * 
 * 
 * 
 * POST
 * 
 * 
 * 
 * 
 */
public async addTrainer(req: Request, res: Response) {
    try {
        const trainerData: ITrainer = req.body;
        console.log("addTrainer trainerData", trainerData);
        console.log("addTrainer trainerData.name", trainerData.name);
        // Validate trainerData
        if (!trainerData.name) {
            return res.status(400).json({ message: 'Trainer name is required' });
        }

        // Find trainer by name - if the name already exists, return an error
        const trainer = await Trainer.findOne({ name: trainerData.name });
        console.log("addTrainer trainer", trainer);

        if (trainer) {
            console.log("error 409");
            return res.status(409).json({ message: 'Trainer name already exists' });
        }

        const newTrainer = new Trainer(trainerData);
        console.log("addTrainer newTrainer", newTrainer);
        await newTrainer.save();
        res.status(201).json(newTrainer);
    } catch (err) {
        console.error("Error adding trainer:", err);
        res.status(500).json({ message: err.message });
    }
}

    public async addInstractor(req: Request, res: Response) {
        try {
            let permission;
            const instractorData: IInstractor = req.body;
            if (!instractorData.permissions 
                || instractorData.permissions == "" 
                || instractorData.permissions == null
                || instractorData.permissions == undefined)
            {
                permission = "regular";
            }
            else if (instractorData.permissions !== "admin" && instractorData.permissions !== "group") {
                permission = "regular";
            }
            else {
                permission = instractorData.permissions;
            }
            const newInstractorData = {
                name: instractorData.name,
                permissions: permission
            }
            //find instractor by name - if the name already exists, return an error
            const instractor = await Instractor.findOne({name: instractorData.name});
            if (instractor) {
                return res.status(409).json({ message: 'name Instractor already exists' });
            }
            const newInstractor = new Instractor(newInstractorData);
            await newInstractor.save();
            res.status(201).json(newInstractor);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }
    public async addPersonalInstractor(req: Request, res: Response) {
        console.log("addPersonalInstractor");
        console.log(req.body);
        try {
            const instractorId = req.body.instractorId;
            const trainerId = req.body.trainerId;
    
            // Find instractor by name - if the name does not exist, return an error
            const instractorData = await Instractor.findOne({ _id: instractorId });
            console.log("instractorData", instractorData);
            if (!instractorData) {
                console.log("error");
                return res.status(409).json({ message: 'name Instractor not exists' });
            }
    
            // Find trainer by name - if the name does not exist, return an error
            const trainerData = await Trainer.findOne({ _id: trainerId });
            console.log("trainerData", trainerData);
            if (!trainerData) {
                console.log("error");
                return res.status(409).json({ message: 'name Trainer not exists' });
            }
    
            // Check if the idTrainer already exists in the PersonalInstractor collection
            const existingPersonalInstractor = await PersonalInstractor.findOne({ idTrainer: trainerData._id.toString() });
            if (existingPersonalInstractor) {
                console.log("error");
                return res.status(409).json({ message: 'Trainer already assigned as a personal instructor' });
            }
    
            // Create a new PersonalInstractor entry
            const addPersonalInstractor: IPersonalInstractor = {
                idInstractor: instractorData._id.toString(),
                idTrainer: trainerData._id.toString()
            };
            const newPersonalInstractor = new PersonalInstractor(addPersonalInstractor);
            await newPersonalInstractor.save();
            res.status(201).json(newPersonalInstractor);
        } catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }

    public async addGroup(req: Request, res: Response) {
        try {
            const group = await Group.findOne({name: req.body.name});
            if (group) {
                return res.status(409).json({ message: 'name Group already exists' });
            }
            const groupData = req.body;
            const newGroup = new Group(groupData);
            await newGroup.save();
            res.status(201).json(newGroup);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }

    public async addSession(req: Request, res: Response) {
        try {
            const session = await Session.findOne({name: req.body.name});
            if (session) {
                return res.status(409).json({ message: 'name Session already exists' });
            }
            const sessionData = req.body;
            const newSession = new Session(sessionData);
            await newSession.save();
            res.status(201).json(newSession);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }

    /**
     * 
     * 
     * 
     * Put
     * 
     * 
     * 
     */

    public async updateTrainer(req: Request, res: Response) {
        console.log("updateTrainer");
        console.log(req.body);
        console.log(req.query);
        try {
            const trainerData: ITrainer = req.body;
            const trainerId = req.query.trainerId;
            console.log("trainerData", trainerData);
            console.log("trainerId", trainerId);
            console.log("trainerData.name", trainerData.name);
            const trainer = await Trainer.findOne({name: trainerData.name});
            console.log("trainer", trainer);
            if (trainer) {
                return res.status(409).json({ message: 'name Trainer already exists' });
            }
            const updatedTrainer = await Trainer.findByIdAndUpdate(trainerId, trainerData, { new: true });
            res.status(200).json(updatedTrainer);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }

    public async updateInstractor(req: Request, res: Response) {
        try {
            const instractorData: IInstractor = req.body;
            const instractorId = req.query.instractorId;
            const instractor = await Instractor.findOne({name: instractorData.name});
            if (instractor && instractor._id.toString() !== instractorId) {
                return res.status(409).json({ message: 'name Instractor already exists' });
            }
            const updatedInstractor = await Instractor.findByIdAndUpdate(instractorId, instractorData, { new: true });
            res.status(200).json(updatedInstractor);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }

    public async updateGroup(req: Request, res: Response) {
        console.log("updateGroup");
        console.log(req.body);
        console.log(req.query);
        try {
            const groupData = req.body;
            const group = await Group.findOne({name: groupData.name});
            if (group && group._id.toString() !== req.query.groupId) {
                return res.status(409).json({ message: 'name Group already exists' });
            }
            const groupId = req.query.groupId;
            const updatedGroup = await Group.findByIdAndUpdate(groupId, groupData, { new: true });
            res.status(200).json(updatedGroup);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }

    public async updateSession(req: Request, res: Response) {
        try {
            const sessionData = req.body;
            const sessionId = req.query.sessionId;
            const updatedSession = await Session.findByIdAndUpdate(sessionId, sessionData, { new: true });
            res.status(200).json(updatedSession);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }
    public async updateIdsTrainersInGroup(req: Request, res: Response) {
        console.log("updateIdsTrainersInGroup");
        console.log(req.body);
        
        try {
            const groupId = req.body.groupId;
            const trainerId = req.body.trainerId;
            const groupData = await Group.findByIdAndUpdate(
                groupId, 
                { $addToSet: { idsTrainers: trainerId } }, 
                { new: true }
            );
            res.status(200).json(groupData);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }
    public async updateIdsInstractorsInGroup(req: Request, res: Response) {
        console.log("updateIdsInstractorsInGroup");
        console.log(req.body);
        
        try {
            const groupId = req.body.groupId;
            const instractorId = req.body.instractorId;
            const groupData = await Group.findByIdAndUpdate(
                groupId, 
                { $addToSet: { idsInstractors: instractorId } }, 
                { new: true }
            );
            res.status(200).json(groupData);
        } catch (err) {
            res.status(409).json({ message: err.message });
        }
    }

    public async updatePersonalInstractor(req: Request, res: Response) {
        console.log("updatePersonalInstractor");
        console.log(req.body);
        //instractorId, trainerId, _id: personalInstractorId
        try {
            const newinstractorId = req.body.instractorId;
            const newTrainerId = req.body.trainerId;
            const personalInstractorId = req.body._id;
    
            const instractorData = await Instractor.find({_id: newinstractorId});
            console.log("instractorData", instractorData);
            if (!instractorData || instractorData.length == 0) {
                console.log("error");
                return res.status(409).json({ message: 'name Instractor not exists' });
            }
    
            const trainerData = await Trainer.find({_id: newTrainerId});
            console.log("trainerData", trainerData);
            if (!trainerData || trainerData.length == 0) {
                console.log("error");
                return res.status(409).json({ message: 'name Trainer not exists' });
            }
    
            console.log("idTrainer", trainerData[0]._id.toString());
            console.log("idInstractor", instractorData[0]._id.toString());
    
            const personalInstractorData = await PersonalInstractor.findOneAndUpdate(
                {_id: personalInstractorId},
                {
                    idTrainer: trainerData[0]._id.toString(),
                    idInstractor: instractorData[0]._id.toString()
                },
                {new: true}
            );
    
            res.status(200).json(personalInstractorData);
        } catch (err) {
            console.log(err);
            res.status(409).json({ message: err.message });
        }
    }

    /**
     * 
     * 
     * delete
     * 
     */


    public async deleteOnlyTrainer(req: Request, res: Response) {
        try {
            const trainerId = req.query.trainerId;
            await Trainer.findByIdAndDelete(trainerId);
            res.status(200).json({ message: 'Trainer deleted successfully' });
        } catch (err) {
            res.status(409).json({ message: err.message });
        }     
    }
    public async deletePersonalInstractorAfterDeleteTrainer(req: Request, res: Response) {
        try {
            const trainerId = req.query.trainerId;
            await PersonalInstractor.findOneAndDelete({idTrainer: trainerId});
            res.status(200).json({ message: 'PersonalInstractor deleted successfully' });
        } catch (err) {
            res.status(409).json({ message: err.message });
        }     
    }
    public async deletePersonalInstractor(req: Request, res: Response) {
        console.log("deletePersonalInstractor");
        try {
            const personalInstractorId = req.query.personalInstractorId;
            console.log("deletePersonalInstractor personalInstractorId", personalInstractorId);
            const r = await PersonalInstractor.findOneAndDelete({_id: personalInstractorId});
            console.log("deletePersonalInstractor res", r);
            res.status(200).json({ message: 'PersonalInstractor deleted successfully' });
        } catch (err) {
            console.log("deletePersonalInstructor err", err);
            res.status(409).json({ message: err.message });
        }
    }
    public async deleteInstractor(req: Request, res: Response){
        try{
            const instractorId = req.query.instractorId;
            await Instractor.findByIdAndDelete(instractorId);
            res.status(200).json({ message: 'Instractor deleted successfully' });
        }catch(err){
            res.status(409).json({ message: err.message });
        }
    }

    public async deleteTheGroup(req: Request, res: Response){
        try{
            const groupId = req.query.groupId;
            await Group.findByIdAndDelete(groupId);
            res.status(200).json({ message: 'Group deleted successfully' });
        }catch(err){
            res.status(409).json({ message: err.message });
        }
    }
    public async deleteSpesificTrainerFromGroup(req: Request, res: Response){
        try{
            const groupId = req.query.groupId;
            const trainerId = req.query.trainerId;
            await Group.findByIdAndUpdate(groupId, { $pull: { idsTrainers: trainerId } });
            res.status(200).json({ message: 'Trainer deleted from group successfully' });
        }catch(err){
            res.status(409).json({ message: err.message });
        }
    }
    public async deleteSession(req: Request, res: Response){
        try{
            const sessionId = req.query.sessionId;
            await Session.findByIdAndDelete(sessionId);
            res.status(200).json({ message: 'Session deleted successfully' });
        }catch(err){
            res.status(409).json({ message: err.message });
        }
    }
    public async deleteSpesificSilabusFromSession(req: Request, res: Response){
        try{
            const sessionId = req.query.sessionId;
            const silabus = req.query.silabus;
            await Session.findByIdAndUpdate(sessionId, { $pull: { silabus: silabus } });
            res.status(200).json({ message: 'Silabus deleted from session successfully' });
        }catch(err){
            res.status(409).json({ message: err.message });
        }
    }
}
export default new UserInfoController();