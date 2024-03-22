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
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryKey = Object.keys(req.query)[0];
                const queryValue = req.query[queryKey];
                if (queryKey && queryValue) {
                    const filter = { [queryKey]: { $regex: new RegExp(String(queryValue), 'i') } };
                    const obj = yield this.model.find(filter);
                    res.send(obj);
                }
                else {
                    const obj = yield this.model.find();
                    res.send(obj);
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = yield this.model.findById(req.params.id);
                res.send(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isExist = null;
                const body = req.body;
                const obj = yield this.model.create(body);
                res.status(201).send(obj);
            }
            catch (err) {
                res.status(406).send("fail 1: " + err.message);
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!obj) {
                    res.status(404).json({ message: "Object not found" });
                }
                res.status(200).json(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterQuery = { _id: req.params.id };
            this.model.deleteOne(filterQuery).then(result => {
                res.status(200).json(result);
            }).catch(err => {
                res.status(500).json({ message: err.message });
            });
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map