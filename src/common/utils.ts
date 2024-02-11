import mongoose from "mongoose";
import user_model from "../models/user_model";
import course_model from "../models/course_model";
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

export async function incCountInCourseName(id) {
    console.log("the course id:" + id);
    const objId = new mongoose.Types.ObjectId(id);
    console.log("the course objId:" + objId)
    try{
        const courseModel = await course_model.findOneAndUpdate({_id: objId}, {$inc: {Count: 1}}, {new: true});
        if (!courseModel) {
            return { message: "Course not found" };
        }
        else{
            console.log("the count in the utils:" + courseModel.Count);
            return courseModel.Count ;
        }
    }
    catch (err) {
        console.log("problem with find the course the buileder the reviews" +err);
        return { message: err.message };
    }
}