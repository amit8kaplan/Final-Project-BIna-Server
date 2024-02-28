import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
const base = process.env.URL;
import fs from 'fs';
class UserController extends BaseController<IUser>{
    constructor() {
        super(User)
    }

    async deletePhotoOfUser(req: AuthResquest, res: Response) {
        //////////////console.log("deletePhotoOfUser:" + req.user._id);
        
    //     fs.unlinkSync("./src/"+prevuser.imgUrl, (err: string) => {
    //         if (err) {
    //             //////console.log("failed to delete local image:" + err);
    //         } else {
    //             //////console.log('successfully deleted local image');
    //         }
    //     });
    // }
        let prevuser;
        try {
            prevuser = await User.findById(req.user._id);
            if (prevuser.imgUrl === "") {
                res.status(500).json({ message: "the user has no photo" });
            }
            fs.unlinkSync("./"+prevuser.imgUrl)
            const user = await User.findByIdAndUpdate(req.user._id, { imgUrl: "" });
            res.status(200).send(user);
        } catch (err) {
            //////console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
    async postPhotoOfUser(req: AuthResquest, res: Response) {
        console.log("postPhotoOfUser")
        try{
            console.log("router.post(/user: " + base + req.file.path)
            await User.findByIdAndUpdate(req.user._id, { imgUrl: req.file.path });
            res.status(200).send({ url: base + req.file.path })
        }catch(err){
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
    async get(req: AuthResquest, res: Response) {
        //////////////console.log("getAllUsers:" + req.query.name);
        super.get(req, res);
    }
    async getById(req: AuthResquest, res: Response) {
        //////////////console.log("getUserById user_controller:" + req.params.id);

        super.getById(req, res);
    }

}
export default new UserController();
