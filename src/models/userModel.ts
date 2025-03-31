import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  navarnaCount: {
    type: Number,
    required: [true],
  },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
