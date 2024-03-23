"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
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
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const obj = yield this.model.create(body);
                res.status(201).send(obj);
            }
            catch (err) {
                res.status(406).json({ message: err.message });
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(obj);
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = { _id: req.params.id };
            this.model.deleteOne(filterQuery).then(result => {
                res.status(200).json(result);
            });
            // }).catch(err => {
            //     res.status(500).json({ message: err.message });
            // });
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map