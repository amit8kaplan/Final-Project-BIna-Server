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
            console.log("Get by query parameter:");
            try {
                const queryKey = Object.keys(req.query)[0]; // Get the first query parameter
                const queryValue = req.query[queryKey]; // Get the value of the first query parameter
                console.log("Query parameter key:", queryKey);
                console.log("Query parameter value:", queryValue);
                if (queryKey && queryValue) {
                    const filter = { [queryKey]: queryValue }; // Type assertion
                    const obj = yield this.model.find(filter);
                    console.log("Filtered results:", obj);
                    res.send(obj);
                }
                else {
                    const obj = yield this.model.find();
                    console.log("All results:", obj);
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
            ////console.log("getById:" + req.params.id);
            try {
                const obj = yield this.model.findById(req.params.id);
                ////console.log("obj to getBiId:" + obj);
                res.send(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("postooObj:");
            // console.log(req.body.title);
            try {
                const isExist = yield this.model.findById(req.body._id);
                // console.log("isExist:" + isExist);
                // console.log(req.body.title)
                const body = req.body;
                // console.log("body.title:" + body.title);
                if (isExist == null) {
                    const obj = yield this.model.create(body);
                    console.log("postnewObj:" + obj);
                    // console.log("title" + req.body.title);
                    res.status(201).send(obj);
                }
                else {
                    res.status(406).send("fail: " + "Object already exist");
                }
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            ////console.log("putObjectById:" + req.params.id);
            try {
                const obj = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                ////console.log("putObjectById:" + obj);
                if (!obj) {
                    res.status(404).json({ message: "Object not found" });
                }
                res.status(200).json(obj);
            }
            catch (err) {
                ////console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            ////console.log("deleteObjectById in base_Controller:" + req.params.id);
            ////console.log("type of the id in base controller: " + typeof(req.params.id));
            this.model.deleteOne({ _id: req.params.id }).then((result) => {
                console.log("result:" + result);
                res.status(200).json(result);
            }).catch((err) => {
                console.log("err:" + err);
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