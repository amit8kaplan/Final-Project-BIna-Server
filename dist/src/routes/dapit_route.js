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
// //gets by filter
router.get('/getByFilterBasicInfo', dapit_Controller_1.default.getByFilterBasicInfo.bind(dapit_Controller_1.default));
router.get('/getByFilter', dapit_Controller_1.default.getByFilter.bind(dapit_Controller_1.default));
router.post('/', dapit_Controller_1.default.post.bind(dapit_Controller_1.default));
router.put('/:id', dapit_Controller_1.default.putById.bind(dapit_Controller_1.default));
router.delete('/:id', dapit_Controller_1.default.deleteById.bind(dapit_Controller_1.default));
exports.default = router;
//# sourceMappingURL=dapit_route.js.map