"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const specific_route_1 = __importDefault(require("./routes/specific_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const user_update_route_1 = __importDefault(require("./routes/user_update_route"));
const courses_route_1 = __importDefault(require("./routes/courses_route"));
const courses_reviews_route_1 = __importDefault(require("./routes/courses_reviews_route"));
const dapit_route_1 = __importDefault(require("./routes/dapit_route"));
const matrics_route_1 = __importDefault(require("./routes/matrics_route"));
const wall_route_1 = __importDefault(require("./routes/wall_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const response_route_1 = __importDefault(require("./routes/response_route"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "*");
                res.header("Access-Control-Allow-Headers", "*");
                res.header("Access-Control-Allow-Credentials", "true");
                next();
            });
            app.use("/course", courses_route_1.default);
            app.use("/review", courses_reviews_route_1.default);
            app.use("/specific", specific_route_1.default);
            app.use("/auth", auth_route_1.default);
            app.use("/user", user_update_route_1.default);
            app.use("/dapit", dapit_route_1.default);
            app.use("/matrics", matrics_route_1.default);
            app.use("/wall", wall_route_1.default);
            app.use("/post", post_route_1.default);
            app.use("/response", response_route_1.default);
            app.use("/public", express_1.default.static("public"));
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map