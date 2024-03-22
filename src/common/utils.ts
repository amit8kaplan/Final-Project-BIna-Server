import mongoose from "mongoose";
import user_model from "../models/user_model";
import course_model, { ICourse } from "../models/course_model";
export async function extractUserName(id : string) {
    const objId = new mongoose.Types.ObjectId(id);
    try{
        const userModel = await user_model.findById(objId);
        if (!userModel) {
            return { message: "User not found" };
        }
        else{
            return userModel.user_name;
        }
    }catch (err) {
        return { message: err.message };
    }
}

export async function incCountInCourseName(id: string) {
    try {
        const courseModel = await course_model.findOneAndUpdate(
            { _id: id }, 
            { $inc: { Count: 1 } }, 
            { new: true }
        );
        if (!courseModel) {
            return { message: "Course not found" };
        } else {
            return (courseModel as ICourse).Count;
        }
    } catch (err) {
        return { message: err.message };
    }
}


export async function decCountInCourseName(id: string | number | mongoose.mongo.BSON.ObjectId | Uint8Array | mongoose.mongo.BSON.ObjectIdLike) {
    const objId = new mongoose.Types.ObjectId(id);
    try{
        const course_obj =await course_model.findById(objId);
        if (!course_obj) {
            return { message: "Course not found" };
        }
        else{
            course_obj.Count = course_obj.Count - 1;
            const count = await course_model.findByIdAndUpdate({_id: objId}, {$set: {Count: course_obj.Count}});
            return count.Count
        }
    }
    catch (err) {
        return { message: err.message };
    }

}
