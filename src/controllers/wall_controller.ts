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

import dapit_model from "../models/dapit_model";
import post_model from "../models/post_model";
import response_model from "../models/response_model";
import { Request, Response } from "express";
import mongoose, { PipelineStage } from "mongoose";

class wall_controller {
    async getWallByTrainerId(req: Request, res: Response) {
        console.log("getWallByTrainerId - controller");
        try {
            const trainerId = req.params.trainerId;
    
            // Main aggregation pipeline for dapits
            const dapitPipeline: PipelineStage[] = [
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
            const postPipeline: PipelineStage[] = [
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
            const [dapits, posts] = await Promise.all([
                dapit_model.aggregate(dapitPipeline),
                post_model.aggregate(postPipeline),
            ]);
            console.log("dapits", JSON.stringify(dapits, null, 2));
            console.log("posts", JSON.stringify(posts, null, 2));
            const combined = [...dapits, ...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());    
            if (combined.length > 0) {
                res.status(200).json(combined);
            } else {
                res.status(404).json({ message: "Wall not found" });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
    async getWallByFilter(req: Request, res: Response) {
        console.log("getWallByFilter - controller");
        const trainerId = req.params.trainerId;

        // Construct filters based on request query parameters
        const partOfStringFilters = {}; // Add your filters here
        const dateFilters = {}; // Add your date filters here

        // Separate filters for dapits and posts
        const dapitFilters = { idTrainer: new mongoose.Types.ObjectId(trainerId), ...partOfStringFilters };
        const postFilters = { idTrainer: new mongoose.Types.ObjectId(trainerId), ...partOfStringFilters, ...dateFilters };

        try {
            const dapitPipeline: PipelineStage[] = [
                { $match: dapitFilters },
                { $sort: { date: -1 } },
                {
                    $lookup: {
                        from: "responses",
                        localField: "_id",
                        foreignField: "idDapit",
                        as: "responses",
                    },
                },
            ];

            const postPipeline: PipelineStage[] = [
                { $match: postFilters },
                { $sort: { date: -1 } },
                {
                    $lookup: {
                        from: "responses",
                        localField: "_id",
                        foreignField: "idPost",
                        as: "responses",
                    },
                },
            ];

            const [dapits, posts] = await Promise.all([
                dapit_model.aggregate(dapitPipeline),
                post_model.aggregate(postPipeline),
            ]);
            console.log("dapits", JSON.stringify(dapits, null, 2));
            console.log("posts", JSON.stringify(posts, null, 2));
            const combined = [...dapits, ...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            if (combined.length > 0) {
                res.status(200).json(combined);
            } else {
                res.status(404).json({ message: "Wall not found" });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new wall_controller();
