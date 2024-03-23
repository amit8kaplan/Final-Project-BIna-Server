import { Request, Response } from "express";
import  { FilterQuery, Model } from "mongoose";

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    // async get(req: Request, res: Response) {
    //     try {
    //         const queryKey = Object.keys(req.query)[0];
    //         const queryValue = req.query[queryKey];
    //         if (queryKey && queryValue) {
    //             const filter: FilterQuery<ModelType> = { [queryKey]: { $regex: new RegExp(String(queryValue), 'i') } } as FilterQuery<ModelType>; 
                        
    //             const obj = await this.model.find(filter);
    //             res.send(obj);
    //         } else {
    //             const obj = await this.model.find();
    //             res.send(obj);
    //         }
    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // }
    
    

    // async getById(req: Request, res: Response) {
    //     try {
    //         const obj = await this.model.findById(req.params.id);
    //         res.send(obj);
    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // }

    async post(req: Request, res: Response) {
            try{const body = req.body;
            const obj = await this.model.create(body);
            res.status(201).send(obj);
            }
            catch(err){
                res.status(406).json({ message: err.message });
            }

   }

    async putById(req: Request, res: Response) {
            const obj = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(obj);
    }
    
    async deleteById(req: Request, res: Response) {
        const filterQuery: FilterQuery<any> = { _id: req.params.id };
        this.model.deleteOne(filterQuery).then(result => {
            res.status(200).json(result);});
        // }).catch(err => {
        //     res.status(500).json({ message: err.message });
        // });
    
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;