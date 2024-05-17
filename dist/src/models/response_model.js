"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const responseSchema = new mongoose_1.default.Schema({
    idPost: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    idDapit: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
});
exports.default = mongoose_1.default.model("Response", responseSchema);
//# sourceMappingURL=response_model.js.map