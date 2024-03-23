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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const courses_reviews_model_1 = __importDefault(require("../models/courses_reviews_model"));
router.get("/", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ////console.log("specfic")
    ////console.log("req.user._id:" + req.user._id);
    try {
        const obj = yield courses_reviews_model_1.default.find({ owner_id: req.user._id });
        ////console.log("obj to getUsingSpesificUser:" + obj);
        res.status(200).send(obj);
    }
    catch (err) {
        ////console.log("error")
        res.status(500).json({ message: err.message });
    }
}));
exports.default = router;
//# sourceMappingURL=specific_route.js.map