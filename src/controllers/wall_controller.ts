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
//     //console.log("getWallByTrainerId - controller");
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
//         //console.log("pipeline", pipeline);
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
//         //console.log("getWallByFilter - controller");
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

import { filterPartOf } from "../common/utils";
import dapit_model from "../models/dapit_model";
import post_model from "../models/post_model";
// import response_model from "../models/response_model";
import comments_model from "../models/comments_model";
import { Request, Response } from "express";
import mongoose, { PipelineStage } from "mongoose";
import likes_model from "../models/likes_model";
import {PostPipeline , DapitPipeline, aggregateDataWall} from "../common/utils";
class wall_controller {

    async getLikes(req: Request, res: Response) {
        //console.log("getLikes - controller");
        try {
            const trainerId = req.params.trainerId;
            //console.log("trainerId", req.params.trainerId);
            // Main aggregation pipeline for dapits
            const dapitPipeline: PipelineStage[] = await DapitPipeline(trainerId);
            
            // Main aggregation pipeline for posts
            const postPipeline: PipelineStage[] = await PostPipeline(trainerId);
    
            // Execute both pipelines in parallel
            const resultsagg = await aggregateDataWall(dapitPipeline,postPipeline)
            const dapits = resultsagg.dapits
            const posts = resultsagg.posts
            //console.log("dapits", dapits);
                //console.log("posts", posts);
            let idsDapits;               
            let idsPosts;
            let likesDapits;
            let likesPosts;
                
            if (dapits.length > 0) {
                idsDapits = dapits.map((dapit) => dapit._id);
                likesDapits = await likes_model.find({ idDapitOrPost: { $in: idsDapits } });
            }
            if (posts.length > 0) {
                idsPosts = posts.map((post) => post._id);
                likesPosts = await likes_model.find({ idDapitOrPost: { $in: idsPosts } });
            }
            const likes = [...likesDapits, ...likesPosts];
            res.status(200).json(likes);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
    }
    async putLike(req: Request, res: Response) {
        console.log("putLike - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const like = req.body.like;
            const count = req.body.count;
            console.log("idDapitOrPost", idDapitOrPost);
            console.log("count", count);
            console.log("like", like);
            
            if (!idDapitOrPost || !like || !count) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            if (like === "like") {
                console.log("like");
                await likes_model.updateOne(
                    { idDapitOrPost: idDapitOrPost },
                    { $inc: { count: 1 } }
                );
                
            }
            else if (like === "dislike") {
                await likes_model.updateOne(
                    { idDapitOrPost: idDapitOrPost },
                    { $inc: { count: -1 } }
                );
            }
            const newLike = await likes_model.findOne({ idDapitOrPost: idDapitOrPost });
            console.log("newLike", newLike);
            res.status(200).json(newLike);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


    async changeFlag(req: Request, res: Response){
        console.log("putFlag - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            console.log("idDapitOrPost", idDapitOrPost);
            if (!idDapitOrPost) {
                return res.status(400).json({ message: "Missing required fields" });
            }
        
            const prevLike = await likes_model.findOne({ idDapitOrPost: idDapitOrPost });
            console.log("prevLike", prevLike);
            
            const newFlag = await likes_model.findByIdAndUpdate({
                _id: prevLike._id,
            }, {
                flag: !prevLike.flag,
            }, {
                new: true,
            });
            console.log("newFlag", newFlag);
            res.status(200).json(newFlag);
        } catch (err) {
            //console.log("err", err);
            
            res.status(500).json({ message: err.message });
        }
    }
    async postLike(req: Request, res: Response) {
        //console.log("postLike - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            //console.log("idDapitOrPost", idDapitOrPost);
            
            if (!idDapitOrPost) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newLike = await likes_model.create({ idDapitOrPost,flag: false, count: 1 });
            console.log("newLike post", newLike);
            res.status(200).json(newLike);
        } catch (err) {
            //console.log("err", err);
            res.status(500).json({ message: err.message})
        }
}

    async getWallByTrainerId(req: Request, res: Response) {
        //console.log("getWallByTrainerId - controller");
        try {
            const trainerId = req.params.trainerId;
            //console.log("trainerId", req.params.trainerId);
            // Main aggregation pipeline for dapits
            const dapitPipeline: PipelineStage[] = await DapitPipeline(trainerId);
            
            // Main aggregation pipeline for posts
            const postPipeline: PipelineStage[] = await PostPipeline(trainerId);
    
            // Execute both pipelines in parallel
            const resultsagg = await aggregateDataWall(dapitPipeline,postPipeline)
            const dapits = resultsagg.dapits
            const posts = resultsagg.posts
            if (dapits.length > 0 || posts.length > 0) {
                // //console.log("dapits", JSON.stringify(dapits, null, 2));
                // //console.log("posts", JSON.stringify(posts, null, 2));
                const combined:any[] = [...dapits, ...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());    
                if (combined.length > 0) {
                    res.status(200).json(combined);
                } 
                else if (combined.length == 0) {
                    res.status(200)
                }else {
                    res.status(404).json({ message: "Wall not found" });
                }
            }
            else if (dapits.length == 0 && posts.length == 0) {
                res.status(200)
            }
        } catch (err) {
            //console.log("err", err);
            res.status(500)
        }
    }
    
    async getWallByFilter(req: Request, res: Response) {
        //console.log("getWallByFilter - controller");
        const trainerId = req.params.trainerId;

        // Construct filters based on request query parameters
        const partOfStringFilters = {
            ...filterPartOf(req, ["nameInstractor", "namePersonalInstructor", "nameTrainer", "group", "session", "summary"]),
        }; // Add your filters here
        const dateFilters = {}; // Add your date filters here

        // Separate filters for dapits and posts
        const dapitFilters = { idTrainer: trainerId,
            ...filterPartOf(req, ["nameInstractor", "namePersonalInstructor", "nameTrainer", "group", "session", "summary" ])
         };
        const postFilters = { 
            idTrainer: trainerId,
            ...filterPartOf(req, ["nameInstractor", "content"])
        };
        //console.log("postFilters", postFilters);
        //console.log("dapitFilters", dapitFilters);
        try {
            const dapitPipeline: PipelineStage[] = [
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

            const postPipeline: PipelineStage[] = [
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

            const [dapits, posts] = await Promise.all([
                dapit_model.aggregate(dapitPipeline),
                post_model.aggregate(postPipeline),
            ]);
            // //console.log("dapits", JSON.stringify(dapits, null, 2));
            // //console.log("posts", JSON.stringify(posts, null, 2));
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
    async getComments(req: Request, res: Response) {
        console.log("getComments - controller");
        try {
            const trainerId = req.params.trainerId;
            console.log("trainerId", req.params.trainerId);
            // Main aggregation pipeline for dapits
            const dapitPipeline: PipelineStage[] = await DapitPipeline(trainerId);
            
            // Main aggregation pipeline for posts
            const postPipeline: PipelineStage[] = await PostPipeline(trainerId);
    
            // Execute both pipelines in parallel
            const resultsagg = await aggregateDataWall(dapitPipeline,postPipeline)
            const dapits = resultsagg.dapits
            console.log("dapits", dapits);
            const posts = resultsagg.posts
            console.log("posts", posts);
            let idsDapits;
            let idsPosts;
            let commentsDapits;
            let commentsPosts;
            if (dapits.length > 0) {
                idsDapits = dapits.map((dapit) => dapit._id);
                console.log("idsDapits", idsDapits);
                commentsDapits = await comments_model.find({ idDapitOrPost: { $in: idsDapits } });
                console.log("commentsDapits", commentsDapits);
            }
            if (posts.length > 0) {
                idsPosts = posts.map((post) => post._id);
                console.log("idsPosts", idsPosts);
                commentsPosts = await comments_model.find({ idDapitOrPost: { $in: idsPosts } });
                console.log("commentsPosts", commentsPosts);
            }
            const comments = [...commentsDapits, ...commentsPosts];
            console.log("getComments", comments);
            res.status(200).json(comments);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async postComment(req: Request, res: Response) {
        console.log("postComment - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const personalName = req.body.personalName;
            const content = req.body.content;
            console.log("idDapitOrPost", idDapitOrPost);
            console.log("personalName", personalName);
            console.log("content", content);
            if (!idDapitOrPost || !personalName || !content) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newComment = await comments_model.create({ idDapitOrPost, count: 1,comments: [{ personalName, content, date: new Date() }] });
            console.log("newComment", newComment);
            res.status(200).json(newComment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async putComment(req: Request, res: Response) {
        console.log("putComment - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const personalName = req.body.personalName;
            const content = req.body.content;
            console.log("idDapitOrPost", idDapitOrPost);
            console.log("personalName", personalName);
            console.log("content", content);
            if (!idDapitOrPost || !personalName || !content) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const prevComment = await comments_model.findOne({ idDapitOrPost: idDapitOrPost });
            console.log("prevComment", prevComment);
            const newComment = await comments_model.findByIdAndUpdate({
                _id: prevComment._id,
            }, {
                $push: { comments: { personalName, content, date: new Date() }, 
                        $inc: { count: 1 } },
            },
            
             {
                new: true,
            });
            console.log("newComment", newComment);
            res.status(200).json(newComment);
        } catch (err) {
            console.log("err", err);
            res.status(500).json({ message: err.message });
        }
    }
    async deleteComment(req: Request, res: Response) {
        console.log("deleteComment - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const commentId = req.body.commentId;
            console.log("idDapitOrPost", idDapitOrPost);
            console.log("commentId", commentId);
            if (!idDapitOrPost || !commentId) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const prevComment = await comments_model.findOne({ idDapitOrPost: idDapitOrPost });
            console.log("prevComment", prevComment);
            const newComments = prevComment.comments.filter((comment) => comment?._id.toString() !== commentId);
            const newComment = await comments_model.findByIdAndUpdate({
                _id: prevComment._id,
            }, {
                comments: newComments,
            }, {
                new: true,
            });
            console.log("newComment", newComment);
            res.status(200).json(newComment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new wall_controller();
