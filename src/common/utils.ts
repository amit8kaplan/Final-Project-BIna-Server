import mongoose from "mongoose";
import user_model from "../models/user_model";

export async function extractUserName(id : string) {
    console.log("the user id:" + id);
    const objId = new mongoose.Types.ObjectId(id);
    console.log("the user objId:" + objId);
    try{
        const userModel = await user_model.findById(objId);
        if (!userModel) {
            return { message: "User not found" };
        }
        else{
            console.log("the user name in utils:" + userModel.user_name);
            return userModel.user_name;
        }
    }catch (err) {
        console.log("problem with find the user of the builder of the course" +err);
        return { message: err.message };
    }
}
