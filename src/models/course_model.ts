import mongoose from "mongoose";
export interface ICourse {
    name: string;
    _id: string;
    owner?: string; // this is the user id
    description?: string;
    Count: number;
}

const couseSchema = new mongoose.Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
  },
  owner: {
      type: String,//this is the user id
  },
  description: {
      type: String, 
  },
  Count: {
      type: Number,
      required: true,
  },
});

export default mongoose.model<ICourse>("Course", couseSchema);
