"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    _id: {
        type: String,
    },
    owner: {
        type: String,
    },
    description: {
        type: String,
    },
    Count: {
        type: Number,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Course", couseSchema);
//# sourceMappingURL=course_model.js.map