import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,

  profile: {
    height: Number,
    weight: Number,
    goal: String,
    level: String,
    injury: String
  }
});

export default mongoose.model("User", userSchema);