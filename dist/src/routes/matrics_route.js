"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const matrics_Controller_1 = __importDefault(require("../controllers/matrics_Controller"));
router.get('/getMegamGradesAvg', matrics_Controller_1.default.getMegamGradesAvg.bind(matrics_Controller_1.default));
router.get('/getAveragePerformance', matrics_Controller_1.default.getAveragePerformance.bind(matrics_Controller_1.default));
exports.default = router;
//# sourceMappingURL=matrics_route.js.map