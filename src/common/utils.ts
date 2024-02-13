import mongoose from "mongoose";
import user_model from "../models/user_model";
import course_model from "../models/course_model";
export async function extractUserName(id : string) {
    //console.log("the user id:" + id);
    const objId = new mongoose.Types.ObjectId(id);
    //console.log("the user objId:" + objId);
    try{
        const userModel = await user_model.findById(objId);
        if (!userModel) {
            return { message: "User not found" };
        }
        else{
            //console.log("the user name in utils:" + userModel.user_name);
            return userModel.user_name;
        }
    }catch (err) {
        //console.log("problem with find the user of the builder of the course" +err);
        return { message: err.message };
    }
}

export async function incCountInCourseName(id: string | number | mongoose.mongo.BSON.ObjectId | Uint8Array | mongoose.mongo.BSON.ObjectIdLike) {
    //console.log("the course id:" + id);
    const objId = new mongoose.Types.ObjectId(id);
    //console.log("the course objId:" + objId)
    try{
        const courseModel = await course_model.findOneAndUpdate({_id: objId}, {$inc: {Count: 1}}, {new: true});
        console.log("the count in the utils:" + courseModel.Count);
        if (!courseModel) {
            return { message: "Course not found" };
        }
        else{
            //console.log("the count in the utils:" + courseModel.Count);
            return courseModel.Count ;
        }
    }
    catch (err) {
        //console.log("problem with find the course the buileder the reviews" +err);
        return { message: err.message };
    }
}

export async function decCountInCourseName(id: string | number | mongoose.mongo.BSON.ObjectId | Uint8Array | mongoose.mongo.BSON.ObjectIdLike) {
    //console.log("the course id:" + id);
    const objId = new mongoose.Types.ObjectId(id);
    //console.log("the course objId:" + objId)
    // try {

    course_model.findByIdAndUpdate({ _id: objId }, { $inc: { Count: -1 } }, { new: true }).then((result) => {   
        console.log("the count in the utils:" + result.Count);
        if (!result) {
            return { message: "Course not found or Count<0" };
        } else {
            console.log("the count in the utils:" + result.Count);
            return result.Count;
        }
    });
}

    //     const query = await course_model.findOne(
    //         { _id: objId },
    //         { new: true }
    //     );
    //     let courseModel =query.toObject();

    //     console.log("the type of count in the utils:" + typeof (courseModel.Count)); 
    //     //  courseModel.Count = courseModel.Count - 1;
    //     await course_model.updateOne({ _id: courseModel._id }, courseModel);
    //     console.log("the count in the utils:" + courseModel.Count);
    //     if (!courseModel) {
    //         return { message: "Course not found or Count<0" };
    //     } else {
    //         //console.log("the count in the utils:" + courseModel.Count);
    //         return courseModel.Count;
    //     }
    // }
    // catch (err) {
    //     //console.log("problem with find the course the buileder the reviews" +err);
    //     return { message: err.message };
    // }
// }