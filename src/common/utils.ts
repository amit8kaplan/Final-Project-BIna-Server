import user_model from "../models/user_model";

export async function extractUserName(id : string) {
    try{
        const userModel = await user_model.findById(id);
        if (!userModel) {
            return { message: "User not found" };
        }
        else{
            return userModel.user_name;
        }
    }catch (err) {
        console.log("problem with find the user of the builder of the course" +err);
        return { message: err.message };
    }
}
