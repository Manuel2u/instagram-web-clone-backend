import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName : String,
  username: String,
  token: String,
});

export default mongoose.model("User", userSchema);
