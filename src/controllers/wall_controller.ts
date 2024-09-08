

// export default new wall_controller();
import { Session } from "inspector";
import { filterPartOf } from "../common/utils";
import dapit_model from "../models/dapit_model";
import post_model from "../models/post_model";
// import response_model from "../models/response_model";
import {sentEmailToUser} from "../common/utils" 
import comments_model from "../models/comments_model";
import { Request, Response } from "express";
import mongoose, { PipelineStage } from "mongoose";
import likes_model from "../models/likes_model";
import {PostPipeline , DapitPipeline, aggregateDataWall, findMail, sendMailUtil,makeAnewRedisClient} from "../common/utils";
import {otptemplateHTML} from "../common/templates";
import 'express-session'; // Ensure this import is present to apply the augmentation
import { ISession } from "../types/express-session";
import { get } from "http";
class wall_controller {

    async getLikes(req: Request, res: Response) {
        //console.log("getLikes - controller");
        try {
            const trainerId = req.params.trainerId;
            //console.log("getLikes trainerId", req.params.trainerId);
            // Main aggregation pipeline for dapits
            const dapitPipeline: PipelineStage[] = await DapitPipeline(trainerId);
            
            // Main aggregation pipeline for posts
            const postPipeline: PipelineStage[] = await PostPipeline(trainerId);
    
            // Execute both pipelines in parallel
            const resultsagg = await aggregateDataWall(dapitPipeline,postPipeline)
            const dapits = resultsagg.dapits
            const posts = resultsagg.posts
            //console.log("getLikes dapits", dapits);
            //console.log("getLikes posts", posts);
            let idsDapits;               
            let idsPosts;
            let likesDapits =[];
            let likesPosts=[];
                
            if (dapits.length > 0) {
                //console.log("dapits.length", dapits.length);
                idsDapits = dapits.map((dapit) => dapit._id);
                likesDapits = await likes_model.find({ idDapitOrPost: { $in: idsDapits } });
            }

            if (posts.length > 0) {
                idsPosts = posts.map((post) => post._id);
                likesPosts = await likes_model.find({ idDapitOrPost: { $in: idsPosts } });
            }
            //console.log("getLikes likesDapits", likesDapits);
            //console.log("getLikes likesPosts", likesPosts);
            const likes = [...likesDapits, ...likesPosts];
            res.status(200).json(likes);
            } catch (err) {
                //console.log( "getLikes err", err);
                res.status(500).json({ message: err.message });
            }
    }
    async putLike(req: Request, res: Response) {
        ////console.log("putLike - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const like = req.body.like;
            const count = req.body.count;
            ////console.log("idDapitOrPost", idDapitOrPost);
            ////console.log("count", count);
            ////console.log("like", like);
            
            if (!idDapitOrPost || !like || !count) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            if (like === "like") {
                ////console.log("like");
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
            ////console.log("newLike", newLike);
            res.status(200).json(newLike);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


    async changeFlag(req: Request, res: Response){
        ////console.log("putFlag - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            ////console.log("idDapitOrPost", idDapitOrPost);
            if (!idDapitOrPost) {
                return res.status(400).json({ message: "Missing required fields" });
            }
        
            const prevLike = await likes_model.findOne({ idDapitOrPost: idDapitOrPost });
            ////console.log("prevLike", prevLike);
            
            const newFlag = await likes_model.findByIdAndUpdate({
                _id: prevLike._id,
            }, {
                flag: !prevLike.flag,
            }, {
                new: true,
            });
            ////console.log("newFlag", newFlag);
            res.status(200).json(newFlag);
        } catch (err) {
            //////console.log("err", err);
            
            res.status(500).json({ message: err.message });
        }
    }
    async postLike(req: Request, res: Response) {
        //////console.log("postLike - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            //////console.log("idDapitOrPost", idDapitOrPost);
            
            if (!idDapitOrPost) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newLike = await likes_model.create({ idDapitOrPost,flag: false, count: 1 });
            ////console.log("newLike post", newLike);
            res.status(200).json(newLike);
        } catch (err) {
            //////console.log("err", err);
            res.status(500).json({ message: err.message})
        }
}

    async getWallByTrainerId(req: Request, res: Response) {
        //////console.log("getWallByTrainerId - controller");
        try {
            const trainerId = req.params.trainerId;
            //////console.log("trainerId", req.params.trainerId);
            // Main aggregation pipeline for dapits
            const dapitPipeline: PipelineStage[] = await DapitPipeline(trainerId);
            
            // Main aggregation pipeline for posts
            const postPipeline: PipelineStage[] = await PostPipeline(trainerId);
    
            // Execute both pipelines in parallel
            const resultsagg = await aggregateDataWall(dapitPipeline,postPipeline)
            const dapits = resultsagg.dapits
            const posts = resultsagg.posts
            if (dapits.length > 0 || posts.length > 0) {
                // //////console.log("dapits", JSON.stringify(dapits, null, 2));
                // //////console.log("posts", JSON.stringify(posts, null, 2));
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
            //////console.log("err", err);
            res.status(500)
        }
    }
    
    async getWallByFilter(req: Request, res: Response) {
        //////console.log("getWallByFilter - controller");
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
        //////console.log("postFilters", postFilters);
        //////console.log("dapitFilters", dapitFilters);
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
            // //////console.log("dapits", JSON.stringify(dapits, null, 2));
            // //////console.log("posts", JSON.stringify(posts, null, 2));
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
        //console.log("getComments - controller");
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
            // //console.log("resultsagg.dapits", dapits);
            const posts = resultsagg.posts
            // //console.log("resultsagg.posts", posts);
            let idsDapits;
            let idsPosts;
            let commentsDapits =[];
            let commentsPosts = [];
            if (dapits.length > 0) {
                idsDapits = dapits.map((dapit) => dapit._id);
                //console.log("idsDapits", idsDapits);
                commentsDapits = await comments_model.find({ idDapitOrPost: { $in: idsDapits } });
                // //console.log("commentsDapits", commentsDapits);
            }
            if (posts.length > 0) {
                idsPosts = posts.map((post) => post._id);
                //console.log("idsPosts", idsPosts);
                commentsPosts = await comments_model.find({ idDapitOrPost: { $in: idsPosts } });
                // //console.log("commentsPosts", commentsPosts);
            }
            const comments = [...commentsDapits, ...commentsPosts];
            //console.log("res comments", comments);
            // const [idDapitOrPost, countofComments] = comments.map((comment) => comment.idDapitOrPost, comment.);
            // //console.log("getComments", comments);
            res.status(200).json(comments);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async postComment(req: Request, res: Response) {
        ////console.log("postComment - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const personalName = req.body.personalName;
            const content = req.body.content;
            ////console.log("idDapitOrPost", idDapitOrPost);
            ////console.log("personalName", personalName);
            ////console.log("content", content);
            if (!idDapitOrPost || !personalName || !content) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newComment = await comments_model.create({ idDapitOrPost, count: 1,comments: [{ personalName, content, date: new Date() }] });
            ////console.log("newComment", newComment);
            res.status(200).json(newComment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async putComment(req: Request, res: Response) {
        ////console.log("putComment - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const personalName = req.body.personalName;
            const content = req.body.content;
            ////console.log("idDapitOrPost", idDapitOrPost);
            ////console.log("personalName", personalName);
            ////console.log("content", content);
            if (!idDapitOrPost || !personalName || !content) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const prevComment = await comments_model.findOne({ idDapitOrPost: idDapitOrPost });
            ////console.log("prevComment", prevComment);
            const newComment = await comments_model.findByIdAndUpdate({
                _id: prevComment._id,
            }, {
                $push: { comments: { personalName, content, date: new Date() }, 
                        $inc: { count: 1 } },
            },
            
             {
                new: true,
            });
            ////console.log("newComment", newComment);
            res.status(200).json(newComment);
        } catch (err) {
            ////console.log("err", err);
            res.status(500).json({ message: err.message });
        }
    }
    async deleteComment(req: Request, res: Response) {
        ////console.log("deleteComment - controller");
        try {
            const idDapitOrPost = req.body.idDapitOrPost;
            const commentId = req.body.commentId;
            ////console.log("idDapitOrPost", idDapitOrPost);
            ////console.log("commentId", commentId);
            if (!idDapitOrPost || !commentId) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const prevComment = await comments_model.findOne({ idDapitOrPost: idDapitOrPost });
            ////console.log("prevComment", prevComment);
            const newComments = prevComment.comments.filter((comment) => comment?._id.toString() !== commentId);
            const newComment = await comments_model.findByIdAndUpdate({
                _id: prevComment._id,
            }, {
                comments: newComments,
            }, {
                new: true,
            });
            ////console.log("newComment", newComment);
            res.status(200).json(newComment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async sentMailOtp(req: Request, res: Response) {
        //console.log("sentMailOtp - controller");
            try{
                if (!req.body.idInstractor) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                // if (getAsync(req.body.idInstractor)) {
                const idInstractorTomail = req.body.idInstractor;
                const emailTo = await findMail(idInstractorTomail);
                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpString = otp.toString();
                const otpEntry = {
                    email: emailTo,
                    otp: otpString,
                    flag: false
                };
                //create session.s
                (req.session as ISession).otp = otpString;
                //console.log((req.session as ISession).otp, "otp");
    
                const otptamplate = otptemplateHTML;
                const data = otptamplate.replace('{{OTP_CODE}}', otpString);
                // //console.log("data", data);
                const subject = 'OTP Verification to BIna';
                const objres = await sendMailUtil(emailTo, subject, data);
                const { setexAsync, getAsync, delAsync, client }= await makeAnewRedisClient();
                await setexAsync(idInstractorTomail, 600, otpString);
                const getOtp = await getAsync(idInstractorTomail);
                res.status(200).json({mail: objres, getOtp: getOtp});
            }catch(err){
                res.status(500).json({message: err.message});
            }
        }
    async verify(req: Request, res: Response) {
        //console.log("verify - controller");
        const otp = (req.session as ISession).otp;
        //console.log("otp", otp);
        try {
            const { otpUser } = req.body;
            //console.log("otpUser", otpUser);
            //console.log("otp", otp);
            if (!otpUser || otpUser !== otp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
            res.status(200).json({ message: "OTP verified" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async sendMail(req: Request, res: Response) {
        //console.log("sendMail - controller");
        const otp = (req.session as ISession).otp;
        try {
            const { email } = req.body;
            //console.log("email", email);
            ////console.log("subject", subject);
            ////console.log("text", text);
            if (!email ) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const results = await sentEmailToUser(email);
            // Send email logic here
            res.status(200).json({ message: "Email sent", results: results });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new wall_controller();
