import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  busId: { type: Number, required: true }, // Supports float e.g., 2.2
  role: { type: String, default: "admin" }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);