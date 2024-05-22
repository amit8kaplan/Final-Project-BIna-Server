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


class wall_controller{

    async getWallByTrainerId(req: Request, res: Response) {
        console.log("getWallByTrainerId - controller");
        try {
          const trainerId = req.params.trainerId;

          // Main aggregation pipeline
          const pipeline:PipelineStage[] = [
            {
                $match: {idTrainer: trainerId,},
            },
            {
              $lookup: {from: "dapits",localField: "_id",foreignField: "idTrainer", as: "dapits",
                pipeline: [
                  {
                    $sort: { date: 1 }, // Sort dapits by date ascending
                  },
                {
                 $lookup: {from: "responses",localField: "_id",foreignField: "idDapit",as: "responses",},   
                }
                ],},
            },
            {
              $lookup: {from: "posts",localField: "_id",foreignField: "idTrainer",as: "posts",
                pipeline: [
                  {
                    $sort: { date: 1 }, // Sort posts by date ascending within the lookup
                  },
                  {$lookup: {from: "responses",localField: "_id",foreignField: "idPost",as: "responses",},
                  },
                ],},
            },
            {
              $project: {
                title: 1,
                content: 1,
                // ... other wall fields
                dapits: 1, // Include dapits as they are already sorted in the lookup stage
                posts: 1, // Include posts as they are already sorted in the lookup stage
              },
            },
            {
              $unwind: {
                path: "$dapits",
                preserveNullAndEmptyArrays: true,
              }
            },
            {
              $unwind: {
                path: "$posts",
                preserveNullAndEmptyArrays: true,
              }
            },
            {
              $sort: { // Final sort based on the date field of both dapits and posts
                "date": 1, // Assuming 'date' exists in both dapit and post models
              },
            },
          ];
      
          const wall = await wall_model.aggregate(pipeline);
      
          if (wall.length > 0) {
            const combined = wall.map(item => ({
              ...item, // Include all wall fields
              type: item.dapits ? 'dapit' : 'post', // Set type based on presence of dapits/posts
            }));
            res.status(200).json(combined);
          } else {
            res.status(404).json({ message: "Wall not found" });
          }
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
      
      
    async getWallByFilter(req: Request, res: Response){
        console.log("getWallByFilter - controller");
        const trainerId = req.params.trainerId;
         // Construct filters based on request query parameters
        const partOfStringFilters = filterPartOf(req, ['nameInstructor', 'namePersonalInstructor', 'nameTrainer', 'group', 'session', 'summary']);
        const dateFilters = filterByDate(req); // Apply date filter for both dapits and posts

        // Separate filters for dapits and posts
        const dapitFilters = { ...partOfStringFilters };
        const postFilters = { ...partOfStringFilters, ...filterPartOf(req, ['content']), ...dateFilters };

        try{

            const pipeline:PipelineStage[] = [
                {
                    $match: {idTrainer: trainerId,},
                },
                {
                    $lookup: {from: "dapits",localField: "_id",foreignField: "idTrainer", as: "dapits",
                        pipeline: [
                            {
                                $match: dapitFilters,
                            },
                            {
                                $sort: { date: 1 }, // Sort dapits by date ascending
                            },
                            {
                                $lookup: {from: "responses",localField: "_id",foreignField: "idDapit",as: "responses",},
                            }
                        ],
                    },
                },
                {
                    $lookup: {from: "posts",localField: "_id",foreignField: "idTrainer",as: "posts",
                        pipeline: [
                            {
                                $match: postFilters,
                            },
                            {
                                $sort: { date: 1 }, // Sort posts by date ascending within the lookup
                            },
                            {
                                $lookup: {from: "responses",localField: "_id",foreignField: "idPost",as: "responses",},
                            }
                        ],
                    },
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        // ... other wall fields
                        dapits: 1, // Include dapits as they are already sorted in the lookup stage
                        posts: 1, // Include posts as they are already sorted in the lookup stage
                    },
                },
                {
                    $unwind: {
                        path: "$dapits",
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $unwind: {
                        path: "$posts",
                        preserveNullAndEmptyArrays: true,
                    }
                },
                {
                    $sort: { // Final sort based on the date field of both dapits and posts
                        "date": 1, // Assuming 'date' exists in both dapit and post models
                    },
                },
            ];

            const wall = await wall_model.aggregate(pipeline);
            if (wall.length > 0) {
                const combined = wall.map(item => ({
                    ...item, // Include all wall fields
                    type: item.dapits ? 'dapit' : 'post', // Set type based on presence of dapits/posts
                }));
                res.status(200).json(combined);
            } else {
                res.status(404).json({ message: "Wall not found" });
            }
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }

}