"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/progress_Data", (req, res) => {
    const progress_Data = [
        { session: 1, finished: 100, total: 100 },
        { session: 2, finished: 100, total: 100 },
        { session: 3, finished: 100, total: 100 },
        { session: 4, finished: 93, total: 100 },
        { session: 5, finished: 79, total: 100 },
        { session: 6, finished: 70, total: 100 },
        { session: 7, finished: 60, total: 100 },
        { session: 8, finished: 0, total: 100 },
        { session: 9, finished: 0, total: 100 },
        { session: 10, finished: 0, total: 100 }
    ];
    console.log("progress_Data");
    console.log(progress_Data);
    res.json(progress_Data);
});
router.get("/avg_progress", (req, res) => {
    const avgResultsData = [
        { session: 1, prevCourseAvg: 7.1, thisCourseAvg: 7.3 },
        { session: 2, prevCourseAvg: 7.2, thisCourseAvg: 7.4 },
        { session: 3, prevCourseAvg: 7.3, thisCourseAvg: 7.5 },
        { session: 4, prevCourseAvg: 7.4, thisCourseAvg: 7.6 },
        { session: 5, prevCourseAvg: 7.5, thisCourseAvg: 7.7 },
        { session: 6, prevCourseAvg: 7.6, thisCourseAvg: 7.8 },
        { session: 7, prevCourseAvg: 7.7, thisCourseAvg: 7.9 },
        { session: 8, prevCourseAvg: 7.8, thisCourseAvg: 8.0 },
        { session: 9, prevCourseAvg: 7.9, thisCourseAvg: 8.1 },
        { session: 10, prevCourseAvg: 8.0, thisCourseAvg: 8.2 }
    ];
    console.log("avgResultsData");
    console.log(avgResultsData);
    res.json(avgResultsData);
});
exports.default = router;
//# sourceMappingURL=progress_data_route.js.map