"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const response_controller_1 = __importDefault(require("../controllers/response_controller"));
//gets all the responses
router.get('/', response_controller_1.default.getAllResponses.bind(response_controller_1.default));
//get response by post id
router.get('/:postId', response_controller_1.default.getResponseByIdPost.bind(response_controller_1.default));
//get response by dapit id
router.get('/:dapitId', response_controller_1.default.getResponseByIdDapit.bind(response_controller_1.default));
//post new response
router.post('/', response_controller_1.default.post.bind(response_controller_1.default));
//update response
router.put('/:id', response_controller_1.default.put.bind(response_controller_1.default));
//delete response
router.delete('/:id', response_controller_1.default.delete.bind(response_controller_1.default));
exports.default = router;
//# sourceMappingURL=response_route.js.map