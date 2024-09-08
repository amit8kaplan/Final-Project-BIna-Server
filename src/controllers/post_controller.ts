import wall_model, { IWall } from "../models/wall_model";
import dapit_model, { IDapit } from "../models/dapit_model";
import post_model, { IPost } from "../models/post_model";
import response_model, { IResponse } from "../models/response_model";
import trainer_model, { ITrainer } from "../models/trainer_model";
import e, { Request, Response } from "express";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { BaseController } from "./base_controller";
import { filterByDate, filterByProfessionalFieldsTospesificData, filterByTags, filterExists, filterParseInt, filterPartOf, filterStringUsingIn, finalFields } from "../common/utils";
import { post } from "../routes/user_update_route";

class post_controller extends BaseController<IPost> {
    constructor() {
        super(post_model)
    }

    async post(req: Request, res: Response) {
        try {
            const body = req.body;
            if (req.file) {
                body.filePath = req.file.path; // Save the file path to the body
            }
            const obj = await post_model.create(body);
            res.status(201).send(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await post_model.find();
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getPostByIdtrainer(req: Request, res: Response) {
        try {
            const trainerId = req.params.trainerId;
            const posts = await post_model.find({ idTrainer: trainerId });
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async put(req: Request, res: Response) {
        try {
            const post = await post_model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(post);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async deleteAllPostWithTrainerId(req: Request, res: Response) {
        try {
            const trainerId = req.query.idTrainer;
            const obj = await post_model.deleteMany({ idTrainer: trainerId });
            res.status(204).json(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            const obj = await post_model.deleteMany();
            res.status(204).json(obj);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await post_model.findByIdAndDelete(id);
            res.status(204).json();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new post_controller();