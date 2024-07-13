import express from "express";
import { finished } from "stream";
const router = express.Router();


router.get("/progress_Data", (req, res) => {
    const progress_Data = [
        { seesion: 1, finished: 100, total: 100 },
        { seesion: 2, finished: 100, total: 100 },
        { seesion: 3, finished: 100, total: 100 },
        { seesion: 4, finished: 93, total: 100 },
        { seesion: 5, finished: 79, total: 100 },
        { seesion: 6, finished: 70, total: 100 },
        { seesion: 7, finished: 60, total: 100 },
        { seesion: 8, finished: 0, total: 100 },
        { seesion: 9, finished: 0, total: 100 },
        { seesion: 10, finished: 0, total: 100 }
    ];
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
      res.json(avgResultsData);
    });

export default router;