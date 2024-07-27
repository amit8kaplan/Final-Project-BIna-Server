import Trainer, {ITrainer} from "../models/trainer_model";
import Instractor, {IInstractor} from "../models/Instractor_model";
import { BaseController } from "./base_controller";
import e, { Request, Response } from "express";
import axios from 'axios'; 
const base = process.env.URL;



class UserInfoController  {

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
}
export default new UserInfoController();