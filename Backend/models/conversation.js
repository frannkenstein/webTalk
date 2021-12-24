import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  scheduleTime: Number,
  time: Number,
  senderId: String,
  receiverId: String,
  messageId: Number,
  roomId: String,
  referenceId: Number,
  message: {
    message: String,
    replied: String,
    read: Boolean,
    attachments: Number,
  },
});

export default mongoose.model("Conversation", conversationSchema);
