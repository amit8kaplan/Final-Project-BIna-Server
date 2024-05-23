"use strict";
// import wall_model, {IWall} from "../models/wall_model";
// import dapit_model, {IDapit} from "../models/dapit_model";
// import post_model, {IPost} from "../models/post_model";
// import response_model, {IResponse} from "../models/response_model";
// import trainer_model, {ITrainer} from "../models/trainer_model";
// import e, {Request, Response} from "express";
// import mongoose, {FilterQuery, PipelineStage} from "mongoose";
// import { BaseController } from "./base_controller";
// import { filterByDate, filterByProfessionalFieldsTospesificData, filterByTags, filterExists, filterParseInt, filterPartOf, filterStringUsingIn, finalFields} from "../common/utils";
// import { post } from "../routes/user_update_route";
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
// class wall_controller{
//   async getWallByTrainerId(req: Request, res: Response) {
//     console.log("getWallByTrainerId - controller");
//     try {
//         const trainerId = req.params.trainerId;
//         if (!trainerId) {
//             return res.status(400).json({ message: "Trainer ID is required" });
//         }
//         // Main aggregation pipeline
//         const pipeline: PipelineStage[] = [
//             {
//                 $match: { idTrainer: new mongoose.Types.ObjectId(trainerId) },
//             },
//             {
//                 $lookup: {
//                     from: "dapits",
//                     localField: "_id",
//                     foreignField: "idTrainer",
//                     as: "dapits",
//                     pipeline: [
//                         { $sort: { date: 1 } },
//                         {
//                             $lookup: {
//                                 from: "responses",
//                                 localField: "_id",
//                                 foreignField: "idDapit",
//                                 as: "responses",
//                             },
//                         },
//                     ],
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "posts",
//                     localField: "_id",
//                     foreignField: "idTrainer",
//                     as: "posts",
//                     pipeline: [
//                         { $sort: { date: 1 } },
//                         {
//                             $lookup: {
//                                 from: "responses",
//                                 localField: "_id",
//                                 foreignField: "idPost",
//                                 as: "responses",
//                             },
//                         },
//                     ],
//                 },
//             },
//             {
//                 $project: {
//                     title: 1,
//                     content: 1,
//                     dapits: 1,
//                     posts: 1,
//                 },
//             },
//             { $unwind: { path: "$dapits", preserveNullAndEmptyArrays: true } },
//             { $unwind: { path: "$posts", preserveNullAndEmptyArrays: true } },
//             { $sort: { date: 1 } },
//         ];
//         console.log("pipeline", pipeline);
//         const wall = await wall_model.aggregate(pipeline);
//         if (wall.length > 0) {
//             const combined = wall.map((item) => ({
//                 ...item,
//                 type: item.dapits ? "dapit" : "post",
//             }));
//             res.status(200).json(combined);
//         } else {
//             res.status(404).json({ message: "Wall not found" });
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
//     async getWallByFilter(req: Request, res: Response){
//         console.log("getWallByFilter - controller");
//         const trainerId = req.params.trainerId;
//          // Construct filters based on request query parameters
//         const partOfStringFilters = filterPartOf(req, ['nameInstructor', 'namePersonalInstructor', 'nameTrainer', 'group', 'session', 'summary']);
//         const dateFilters = filterByDate(req); // Apply date filter for both dapits and posts
//         // Separate filters for dapits and posts
//         const dapitFilters = { ...partOfStringFilters };
//         const postFilters = { ...partOfStringFilters, ...filterPartOf(req, ['content']), ...dateFilters };
//         try{
//             const pipeline:PipelineStage[] = [
//                 {
//                     $match: {idTrainer: trainerId,},
//                 },
//                 {
//                     $lookup: {from: "dapits",localField: "_id",foreignField: "idTrainer", as: "dapits",
//                         pipeline: [
//                             {
//                                 $match: dapitFilters,
//                             },
//                             {
//                                 $sort: { date: 1 }, // Sort dapits by date ascending
//                             },
//                             {
//                                 $lookup: {from: "responses",localField: "_id",foreignField: "idDapit",as: "responses",},
//                             }
//                         ],
//                     },
//                 },
//                 {
//                     $lookup: {from: "posts",localField: "_id",foreignField: "idTrainer",as: "posts",
//                         pipeline: [
//                             {
//                                 $match: postFilters,
//                             },
//                             {
//                                 $sort: { date: 1 }, // Sort posts by date ascending within the lookup
//                             },
//                             {
//                                 $lookup: {from: "responses",localField: "_id",foreignField: "idPost",as: "responses",},
//                             }
//                         ],
//                     },
//                 },
//                 {
//                     $project: {
//                         title: 1,
//                         content: 1,
//                         // ... other wall fields
//                         dapits: 1, // Include dapits as they are already sorted in the lookup stage
//                         posts: 1, // Include posts as they are already sorted in the lookup stage
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$dapits",
//                         preserveNullAndEmptyArrays: true,
//                     }
//                 },
//                 {
//                     $unwind: {
//                         path: "$posts",
//                         preserveNullAndEmptyArrays: true,
//                     }
//                 },
//                 {
//                     $sort: { // Final sort based on the date field of both dapits and posts
//                         "date": 1, // Assuming 'date' exists in both dapit and post models
//                     },
//                 },
//             ];
//             const wall = await wall_model.aggregate(pipeline);
//             if (wall.length > 0) {
//                 const combined = wall.map(item => ({
//                     ...item, // Include all wall fields
//                     type: item.dapits ? 'dapit' : 'post', // Set type based on presence of dapits/posts
//                 }));
//                 res.status(200).json(combined);
//             } else {
//                 res.status(404).json({ message: "Wall not found" });
//             }
//         }catch(err){
//             res.status(500).json({message: err.message});
//         }
//     }
// }
// export default new wall_controller();
const utils_1 = require("../common/utils");
const dapit_model_1 = __importDefault(require("../models/dapit_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
class wall_controller {
    getWallByTrainerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getWallByTrainerId - controller");
            try {
                const trainerId = req.params.trainerId;
                // Main aggregation pipeline for dapits
                const dapitPipeline = [
                    {
                        $match: { idTrainer: trainerId },
                    },
                    {
                        $sort: { date: -1 }, // Sort dapits by date ascending
                    },
                    {
                        $lookup: {
                            from: "responses",
                            let: { dapitId: "$_id" }, // Define variable to hold the ObjectId as string
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$idDapit", { $toString: "$$dapitId" }] }, // Convert ObjectId to string for comparison
                                    },
                                },
                            ],
                            as: "responses",
                        },
                    },
                ];
                // Main aggregation pipeline for posts
                const postPipeline = [
                    {
                        $match: { idTrainer: trainerId },
                    },
                    {
                        $sort: { date: -1 }, // Sort posts by date ascending
                    },
                    {
                        $lookup: {
                            from: "responses",
                            let: { postId: "$_id" }, // Define variable to hold the ObjectId as string
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$idPost", { $toString: "$$postId" }] }, // Convert ObjectId to string for comparison
                                    },
                                },
                            ],
                            as: "responses",
                        },
                    },
                ];
                // Execute both pipelines in parallel
                const [dapits, posts] = yield Promise.all([
                    dapit_model_1.default.aggregate(dapitPipeline),
                    post_model_1.default.aggregate(postPipeline),
                ]);
                // console.log("dapits", JSON.stringify(dapits, null, 2));
                // console.log("posts", JSON.stringify(posts, null, 2));
                const combined = [...dapits, ...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                if (combined.length > 0) {
                    res.status(200).json(combined);
                }
                else {
                    res.status(404).json({ message: "Wall not found" });
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getWallByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getWallByFilter - controller");
            const trainerId = req.params.trainerId;
            // Construct filters based on request query parameters
            const partOfStringFilters = Object.assign({}, (0, utils_1.filterPartOf)(req, ["nameInstructor", "namePersonalInstructor", "nameTrainer", "group", "session", "summary"])); // Add your filters here
            const dateFilters = {}; // Add your date filters here
            // Separate filters for dapits and posts
            const dapitFilters = Object.assign({ idTrainer: trainerId }, (0, utils_1.filterPartOf)(req, ["nameInstructor", "namePersonalInstructor", "nameTrainer", "group", "session", "summary"]));
            const postFilters = Object.assign({ idTrainer: trainerId }, (0, utils_1.filterPartOf)(req, ["nameInstructor", "content"]));
            try {
                const dapitPipeline = [
                    { $match: dapitFilters },
                    { $sort: { date: -1 } },
                    {
                        $lookup: {
                            from: "responses",
                            let: { dapitId: "$_id" }, // Define variable to hold the ObjectId as string
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$idDapit", { $toString: "$$dapitId" }] }, // Convert ObjectId to string for comparison
                                    },
                                },
                            ],
                            as: "responses",
                        },
                    },
                ];
                const postPipeline = [
                    { $match: postFilters },
                    { $sort: { date: -1 } },
                    {
                        $lookup: {
                            from: "responses",
                            let: { postId: "$_id" }, // Define variable to hold the ObjectId as string
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$idPost", { $toString: "$$postId" }] }, // Convert ObjectId to string for comparison
                                    },
                                },
                            ],
                            as: "responses",
                        },
                    },
                ];
                const [dapits, posts] = yield Promise.all([
                    dapit_model_1.default.aggregate(dapitPipeline),
                    post_model_1.default.aggregate(postPipeline),
                ]);
                // console.log("dapits", JSON.stringify(dapits, null, 2));
                // console.log("posts", JSON.stringify(posts, null, 2));
                const combined = [...dapits, ...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                if (combined.length > 0) {
                    res.status(200).json(combined);
                }
                else {
                    res.status(404).json({ message: "Wall not found" });
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new wall_controller();
//# sourceMappingURL=wall_controller.js.map