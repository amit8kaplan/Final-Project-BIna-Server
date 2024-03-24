import { Request, Response } from "express";
import  { FilterQuery, Model } from "mongoose";

export class BaseController<ModelType>{

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }    


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
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;