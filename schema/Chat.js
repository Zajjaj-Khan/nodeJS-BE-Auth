import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type:String , ref: "User", required: true },
  sessionName: { type: String, required: true }, 
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
