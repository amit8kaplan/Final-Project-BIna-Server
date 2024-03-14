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
            await User.findByIdAndUpdate(req.user._id, { imgUrl: base + req.file.path });
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
        try {
            const obj = await this.model.findById(req.user._id);
            const resUser = {
                email : obj.email,
                imgUrl: obj.imgUrl,
                user_name: obj.user_name,
            }
            console.log("getById obj :", JSON.stringify(resUser, null, 2));
            res.send(resUser);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }   
     }

     async patchById(req: AuthResquest, res: Response) {
        try {
            const userId = req.params.id; // Ensure this is the correct user ID parameter from your route
            const updates = req.body;

            // Find the user and apply updates
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            Object.keys(updates).forEach((key) => {
                if (key in user) {
                    user[key] = updates[key];
                }
            });

            await user.save();
            res.send(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export default new UserController();
