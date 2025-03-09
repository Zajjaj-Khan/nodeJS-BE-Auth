import e from "express";
import Chat from "../schema/Chat.js"
import {ensureAuthenticated} from '../middleware/auth.js'

const router = e.Router();

// Get User's Chats
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a Chat Message
router.post("/new-session", ensureAuthenticated, async (req, res) => {
    try {
      const { sessionName, messages } = req.body;
  
      if (messages.length > 0) {
        await Chat.create({
          userId: req.user.id,
          sessionName,
          messages,
        });
      }
  
      res.status(201).json({ message: "New session started", sessionName });
    } catch (err) {
      console.error("❌ Error creating session:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get("/sessions", ensureAuthenticated, async (req, res) => {
    try {

      const sessions = await Chat.find({ userId:req.user.id }).select("sessionName createdAt messages");
  
      res.json(sessions);
    } catch (err) {
      console.error("❌ Chat Fetch Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

export default router;
