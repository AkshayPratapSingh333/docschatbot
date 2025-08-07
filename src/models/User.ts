import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    required: [true, "Name field is required."],
    minLength: [2, "Name must be 2 character long."],
    type: Schema.Types.String,
  },

  email: {
    required: [true, "Email field is required."],
    type: Schema.Types.String,
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
  },
  role:{
    type: Schema.Types.String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
   chatSessions: [{ type: Schema.Types.ObjectId, ref: 'ChatSession' }]
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
