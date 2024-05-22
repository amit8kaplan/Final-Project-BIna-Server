import wall_model, {IWall} from "../models/wall_model";
import dapit_model, {IDapit} from "../models/dapit_model";
import post_model, {IPost} from "../models/post_model";
import response_model, {IResponse} from "../models/response_model";
import trainer_model, {ITrainer} from "../models/trainer_model";
import e, {Request, Response} from "express";
import mongoose, {FilterQuery, PipelineStage} from "mongoose";
import { BaseController } from "./base_controller";
import { filterByDate, filterByProfessionalFieldsTospesificData, filterByTags, filterExists, filterParseInt, filterPartOf, filterStringUsingIn, finalFields} from "../common/utils";
import { post } from "../routes/user_update_route";

class resonse_controller extends BaseController<IResponse>{
    constructor(){
        super(response_model)
    }
    async post(req: Request, res: Response){
        console.log("post - controller");
        try{
            const newResponse = new response_model(req.body);
            await newResponse.save();
            res.status(201).json(newResponse);
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async getAllResponses(req: Request, res: Response){
        console.log("getAllResponses - controller");
        try{
            const responses = await response_model.find();
            res.status(200).json(responses);
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async getResponseByIdPost(req: Request, res: Response){
        console.log("getResponseByIdPost - controller");
        try{
            const postId = req.params.postId;
            const responses = await response_model.find({idPost: postId});
            res.status(200).json(responses);
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async getResponseByIdDapit(req: Request, res: Response){
        console.log("getResponseByIdDapit - controller");
        try{
            const dapitId = req.params.dapitId;
            const responses = await response_model.find({idDapit: dapitId});
            res.status(200).json(responses);
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async put(req: Request, res: Response){
        console.log("put - controller");
        try{
            const id = req.params.id;
            const response = await response_model.findByIdAndUpdate(id, req.body)
            res.status(200).json(response);
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
    async delete(req: Request, res: Response){
        console.log("delete - controller");
        try{
            const id = req.params.id;
            await response_model.findByIdAndDelete(id);
            res.status(204).json();
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
}

export default new resonse_controller();