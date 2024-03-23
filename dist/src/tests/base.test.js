"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../controllers/base_controller");
const mongoose_1 = require("mongoose");
describe('BaseController tests', () => {
    it('should create a new instance of BaseController', () => {
        const baseController = new base_controller_1.BaseController(mongoose_1.Model);
        expect(baseController).toBeInstanceOf(base_controller_1.BaseController);
    });
    it('get method should call find method of model', () => __awaiter(void 0, void 0, void 0, function* () {
        const baseController = new base_controller_1.BaseController(mongoose_1.Model);
        const req = {};
        const res = {};
        const model = {
            find: jest.fn().mockResolvedValue([])
        };
        baseController.get(req, res);
        expect(model.find).toHaveBeenCalled();
    }));
    it('getById method should call findById method of model', () => __awaiter(void 0, void 0, void 0, function* () {
        const baseController = new base_controller_1.BaseController(mongoose_1.Model);
        const req = { params: { id: '1' } };
        const res = {};
        const model = {
            findById: jest.fn().mockResolvedValue({})
        };
        baseController.getById(req, res);
        expect(model.findById).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=base.test.js.map