"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wallSchema = new mongoose_1.default.Schema({
    idTrainer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    dapits: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
    },
    posts: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
    },
});
exports.default = mongoose_1.default.model("Wall", wallSchema);
//# sourceMappingURL=wall_model.js.map