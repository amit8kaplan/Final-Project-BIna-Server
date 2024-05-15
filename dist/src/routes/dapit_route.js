"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dapit_Controller_1 = __importDefault(require("../controllers/dapit_Controller"));
//gets all the dapit
router.get('/', dapit_Controller_1.default.get.bind(dapit_Controller_1.default));
//gets by tags
// router.get('/getByTags', dapit_Controller.getByTags.bind(dapit_Controller));
// //gets by filter
router.get('/getByFilterBasicInfo', dapit_Controller_1.default.getByFilterBasicInfo.bind(dapit_Controller_1.default));
router.get('/getByFilter', dapit_Controller_1.default.getByFilter.bind(dapit_Controller_1.default));
// router.get('/:id', dapit_Controller.getByUserId.bind(dapit_Controller));
// router.get('/getByTrainer/:id', dapit_Controller.getByTrainer.bind(dapit_Controller));
// router.get('/getByPersonalInstractor/:id', dapit_Controller.getByPersonalInstractor.bind(dapit_Controller));
// router.get('/getByInstractor/:id', dapit_Controller.getByInstractor.bind(dapit_Controller));
// router.get('/getByGroup/:id', dapit_Controller.getByGroup.bind(dapit_Controller));
// router.get('/getByRangeDate/:id', dapit_Controller.getByDate.bind(dapit_Controller));
router.post('/', dapit_Controller_1.default.post.bind(dapit_Controller_1.default));
// router.put('/:id', dapit_Controller.putById.bind(dapit_Controller));
// router.delete('/:id', dapit_Controller.deleteById.bind(dapit_Controller));
exports.default = router;
//# sourceMappingURL=dapit_route.js.map