"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    console.log("authMiddleware");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (token == null) {
        console.log("token is null");
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        try {
            console.log("err2 " + err);
            if (err)
                return res.sendStatus(401);
            req.user = user;
            //////////console.log("the auth" + req.user);
            console.log("the auth" + req.user._id);
            console.log("authMiddleware next");
            next();
        }
        catch (err) {
            console.log("authMiddleware error");
            res.status(500).json({ message: err.message });
        }
    });
};
exports.default = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map