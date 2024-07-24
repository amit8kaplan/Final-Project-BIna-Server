"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const personalInstractorSchema = new mongoose_1.default.Schema({
    idInstractor: {
        type: String,
        required: true,
    },
    idTrainer: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("PersonalInstractor", personalInstractorSchema);
//# sourceMappingURL=PersonalInstractor_model.js.map