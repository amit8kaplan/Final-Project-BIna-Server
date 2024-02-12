import mongoose from "mongoose";
export interface ICourse {
    name: string;
    _id?: string;
    owner: string; // this is the user id
    owner_name: string;
    description?: string;
    videoUrl?: string;
    Count: number;
}

const couseSchema = new mongoose.Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,//this is the user id
    required : true,
    },
  owner_name: {
      type: String,
      required: true,
  },
  description: {
      type: String, 
  },
  Count: {
      type: Number,
      required: true,
  },
  videoUrl: {
      type: String,
  }
});

export default mongoose.model<ICourse>("Course", couseSchema);
