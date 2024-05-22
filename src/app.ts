import env from "dotenv";
env.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import spesRoute from "./routes/specific_route";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_update_route";
import cousreRoute from "./routes/courses_route";
import courseReviewRoute from "./routes/courses_reviews_route";
import dapitRoute from "./routes/dapit_route";
import matricsRoute from "./routes/matrics_route";
import wallRoute from "./routes/wall_route";
const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
      })
      app.use("/course", cousreRoute);
      app.use("/review", courseReviewRoute);
      app.use("/specific", spesRoute)
      app.use("/auth", authRoute);
      app.use("/user", userRoute);
      app.use("/dapit", dapitRoute)
      app.use("/matrics", matricsRoute)
      app.use("/wall", wallRoute)
      app.use("/public", express.static("public"));
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
