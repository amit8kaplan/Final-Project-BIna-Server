"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    idTrainer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
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
    responses: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
    },
});
exports.default = mongoose_1.default.model("Post", postSchema);
//# sourceMappingURL=post_model.js.map