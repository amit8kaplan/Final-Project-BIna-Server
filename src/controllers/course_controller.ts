import course_model, { ICourse } from "../models/course_model";
import createController from "./base_controller";

const course_controller = createController<ICourse>(course_model);

export default course_controller
