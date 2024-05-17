// import wall_model, {IWall} from "../models/wall_model";
// import dapit_model, {IDapit} from "../models/dapit_model";
// import post_model, {IPost} from "../models/post_model";
// import response_model, {IResponse} from "../models/response_model";
// import trainer_model, {ITrainer} from "../models/trainer_model";
// import {Request, Response} from "express";
// import mongoose, {FilterQuery} from "mongoose";
// import { BaseController } from "./base_controller";
// class wall_controller{
//     async getWallByTrainerId(req: Request, res: Response){
//         console.log("getWallByTrainerId - controller");
//         try{
//             const trainerId = req.params.trainerId;
//             const wall = await wall_model.findOne({idTrainer: trainerId})
//                 .populate('dapits')
//                 .populate({path:'posts',
//                 populate: {path: 'responses'}
//             });
//             if(wall){
//                 res.status(200).json(wall);
//             }else{
//                 res.status(404).json({message: "Wall not found"});
//             }
//         }catch(err){
//             res.status(500).json({message: err.message});
//         }
//     }
//     async getWallByFilter(req: Request, res: Response){
//         console.log("getWallByFilter - controller");
//         const trainerId = req.params.trainerId;
//         let filters: any[] = [];
//         if 
//         try{
//             const trainerId = req.params.trainerId;
//             const wall = await wall_model.findOne({idTrainer: trainerId})
//                 .populate({
//                     path: 'posts',
//                     match: {tags: req.body.tags}
//                 });
//             if(wall){
//                 res.status(200).json(wall);
//             }else{
//                 res.status(404).json({message: "Wall not found"});
//             }
//         }catch(err){
//             res.status(500).json({message: err.message});
//         }
//     }
//     async getWallByTrainerIdAndFilter(req: Request, res: Response){
//         console.log("getWallByTrainerIdAndFilter - controller");
//         try{
//             const trainerId = req.params.trainerId;
//             const wall = await wall_model.findOne({idTrainer: trainerId})
//                 .populate({
//                     path: 'posts',
//                     match: {tags: req.body.tags}
//                 });
//             if(wall){
//                 res.status(200).json(wall);
//             }else{
//                 res.status(404).json({message: "Wall not found"});
//             }
//         }catch(err){
//             res.status(500).json({message: err.message});
//         }
//     }
//# sourceMappingURL=wall_controller.js.map