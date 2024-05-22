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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_model_1 = __importDefault(require("../models/response_model"));
const base_controller_1 = require("./base_controller");
class resonse_controller extends base_controller_1.BaseController {
    constructor() {
        super(response_model_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post response - controller");
            try {
                const body = req.body;
                const obj = yield response_model_1.default.create(body);
                res.status(201).send(obj);
            }
            catch (err) {
                console.log("err", err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    getAllResponses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAllResponses - controller");
            try {
                const responses = yield response_model_1.default.find();
                res.status(200).json(responses);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getResponseByIdPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getResponseByIdPost - controller");
            try {
                const postId = req.params.postId;
                const responses = yield response_model_1.default.find({ idPost: postId });
                res.status(200).json(responses);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getResponseByIdDapit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getResponseByIdDapit - controller");
            try {
                const dapitId = req.params.dapitId;
                const responses = yield response_model_1.default.find({ idDapit: dapitId });
                res.status(200).json(responses);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("put - controller");
            try {
                const id = req.params.id;
                const response = yield response_model_1.default.findByIdAndUpdate(id, req.body);
                res.status(200).json(response);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("delete - controller");
            try {
                const id = req.params.id;
                yield response_model_1.default.findByIdAndDelete(id);
                res.status(204).json();
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.default = new resonse_controller();
//# sourceMappingURL=response_controller.js.map