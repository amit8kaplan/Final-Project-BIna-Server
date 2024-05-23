"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const wall_controller_1 = __importDefault(require("../controllers/wall_controller"));
//get the wall of the triner
router.get('/:trainerId', wall_controller_1.default.getWallByTrainerId.bind(wall_controller_1.default));
// gets wall by filter
router.get('/:trainerId/getByFilter', wall_controller_1.default.getWallByFilter.bind(wall_controller_1.default));
exports.default = router;
//# sourceMappingURL=wall_route.js.map