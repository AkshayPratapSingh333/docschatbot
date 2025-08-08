import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: [true, "Name field is required."],
    minLength: [2, "Name must be 2 character long."],
  },
  chatSessions: [{ type: Schema.Types.ObjectId, ref: 'ChatSession' }]
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
