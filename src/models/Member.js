import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  gender: { type: String, required: true }, // Add this
  busId: { type: Number, required: true }, // Ensure this is Number
  isPresent: { type: Boolean, default: true },
  assignedKaryakar: { type: String }, // Add this
});

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);