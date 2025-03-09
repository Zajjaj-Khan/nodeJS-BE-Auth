import e from "express";
import dotenv from "dotenv";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
dotenv.config();
const router = e.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import User from '../schema/User.js';
import Chat from "../schema/Chat.js";
import { ensureAuthenticated } from "../middleware/auth.js";

// Google OAuth Login Route
router.post("/google-popup", async (req, res) => {
    
  
    const { token } = req.body;
  
    if (!token) {

      return res.status(400).json({ error: "Missing Google token" });
    }
  
 
  
    try {
      const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { id, email, name, picture } = userInfoRes.data;
    
  
      // ✅ Check if user exists, otherwise create a new user
      let user = await User.findOne({ googleId: id });
  
      if (!user) {
        user = await User.create({
          googleId: id,
          email,
          name,
          avatar: picture,
        });
      }
  
      
  
      req.session.user = { id: user.googleId, name: user.name, email: user.email, avatar: user.avatar };

      res.json(user)
    } catch (err) {
     
      res.status(400).json({ error: "Invalid Google Token" });
    }
  });
  router.get("/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      }
  
      const token = authHeader.split(" ")[1]; 
  
      
      const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { id, email, name, picture } = userInfoRes.data;
  
      res.json({
        googleId: id,
        email,
        name,
        avatar: picture,
      });
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  });
// Logout
router.post("/logout", ensureAuthenticated, async (req, res) => {
    try {
        const { sessionName, messages } = req.body; 
    
        console.log("hello", messages)
        if (messages.length > 0) {
          await Chat.create({
            userId:req.user.id,
            sessionName,
            messages,
          });
        }
    
        req.session.destroy((err) => {
          if (err) return res.status(500).json({ error: "Logout failed" });
          res.json({ message: "Logged out successfully" });
        });
      } catch (err) {
        console.error("❌ Logout Error:", err);
        res.status(500).json({ error: "Server error" });
      }
    });
  
export default router;
