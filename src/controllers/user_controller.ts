import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
const base = process.env.URL;
import fs from 'fs';
import { FilterQuery } from "mongoose";
class UserController extends BaseController<IUser>{
    constructor() {
        super(User)
    }

    async deletePhotoOfUser(req: AuthResquest, res: Response) {
        let prevuser;
        try {
            console.log("deletePhotoOfUser")
            prevuser = await User.findById(req.user._id);
            console.log("prevuser.imgUrl: ", prevuser.imgUrl)
            if (prevuser.imgUrl === "") {
                console.log("the user has no photo inside the if")
                res.status(500).json({ message: "the user has no photo" });
            }
            // fs.unlinkSync("./"+prevuser.imgUrl)
            const user = await User.findByIdAndUpdate(req.user._id, { imgUrl: "" });
            res.status(200).send(user);
        } catch (err) {
            console.log("the user have error in deletePhotoOfUser")
            //////////console.log(err);
            res.status(500);
        }
    }
    async postPhotoOfUser(req: AuthResquest, res: Response) {
        ////console.log("postPhotoOfUser")
        ////console.log("postPhotoOfUser", JSON.stringify(req.file, null, 2));
        try{
            ////console.log("router.post(/user: " + base + req.file.path)
            await User.findByIdAndUpdate(req.user._id, { imgUrl: base + req.file.path });
            res.status(200).send({ url: base + req.file.path })
        }catch(err){
            ////console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
    async get(req: AuthResquest, res: Response) {
        //////////////////console.log("getAllUsers:" + req.query.name);
        if (req.query.name || req.query.email || req.query.imgUrl || req.query.user_name) {
            let filter: FilterQuery<IUser>;
            if (req.query.name) filter = { name: req.query.name as string };
            if (req.query.email) filter = { email: req.query.email as string };
            if (req.query.imgUrl) filter = { imgUrl: req.query.imgUrl as string };
            if (req.query.user_name) filter = { user_name: req.query.user_name as string };

            const obj = await this.model.find(filter);
            res.status(200).send(obj);
        }
        else {
            const obj = await this.model.find();
            res.status(200).send(obj);
        }            
        // super.get(req, res);
    }
    async getById(req: AuthResquest, res: Response) {
        //////////////////console.log("getUserById user_controller:" + req.params.id);
        try {
            const obj = await this.model.findById(req.user._id);
            const resUser = {
                email : obj.email,
                imgUrl: obj.imgUrl,
                user_name: obj.user_name,
                password: obj.user_name
            }
            ////console.log("getById obj :", JSON.stringify(resUser, null, 2));
            res.send(resUser);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }    }
    async putById(req: AuthResquest, res: Response){
        ////console.log("putById in User_Controller", JSON.stringify(req.body, null,2))
        try {
            const user = await this.model.findByIdAndUpdate(req.user._id, req.body, { new: true });
            // if (!user) {
            //     res.status(404).json({ message: "user not found" });
            // }
            ////console.log("the res of putById: ", JSON.stringify(user, null, 2));
            res.status(200).json(user);
        } catch (err) {
            //////////////////console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
}

export default new UserController();
