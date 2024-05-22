"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const responseSchema = new mongoose_1.default.Schema({
    idPost: {
        type: String,
    },
    idDapit: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    idTrainer: {
        type: String,
        required: true,
    },
    idInstuctor: {
        type: String,
        required: true,
    },
    nameInstractor: {
        type: String,
        required: true,
    },
    nameTrainer: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Response", responseSchema);
//# sourceMappingURL=response_model.js.map