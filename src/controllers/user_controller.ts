import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
const base = process.env.URL;
class UserController extends BaseController<IUser>{
    constructor() {
        super(User)
    }

    async deletePhotoOfUser(req: AuthResquest, res: Response) {
        console.log("deletePhotoOfUser:" + req.user._id);
        try {
            const user = await User.findByIdAndUpdate(req.user._id, { imgUrl: "" });
            res.status(200).send(user);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }

    async postPhotoOfUser(req: AuthResquest, res: Response) {
        console.log("router.post(/file: " + base + req.file.path)
        res.status(200).send({ url: base + req.file.path })
    }

}
export default new UserController();
