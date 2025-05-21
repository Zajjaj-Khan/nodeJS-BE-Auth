import e from "express";
import dotenv from "dotenv";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import bcrypt from 'bcrypt'
dotenv.config();
const router = e.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import User from '../schema/User.js';
import { authenticateJWT} from "../middleware/auth.js";
import { randString , sendEmail} from "../utils/helper.js";
import jwt from 'jsonwebtoken'
//route for Registeration
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const uniqueString = randString();
    const isVerified = false;
    const saltRounds = 10;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        isVerified,
        verificationCode: uniqueString,
        ...req.body
      });

      sendEmail(email, uniqueString);
      return res.status(201).json(user); // ✅ added return
    }

    return res.status(400).json('This Email is Already Registered'); // ✅ added return

  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal server error');
  }
});

//route for verification code
router.get('/verify/:verificationCode', async (req, res) => {
  const { verificationCode } = req.params;
  console.log("Verification Code:", verificationCode); // Debugging

  if (!verificationCode) {
    return res.status(400).json({ error: 'Verification code is required' });
  }

  try {
    // Find the user by verification code
    const user = await User.findOne({ verificationCode });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if the verification code has already been used
    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Update the user to mark as verified
    user.isVerified = true;
    await user.save(); // Save the updated user document

    // Return the updated user
    res.json({ message: 'User verified successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth Login Route
router.post("/google-popup", async (req, res) => {
  const { token } = req.body;

  console.log("Received Google Token:", token); // Debugging

  if (!token) {
      return res.status(400).json({ error: "Missing Google token" });
  }

  try {
      const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Google Response:", userInfoRes.data); // Debugging

      const { id, email, name, picture } = userInfoRes.data;

      // ✅ Check if user exists, otherwise create a new user
      let user = await User.findOne({
        $or: [{ googleId: id }, { email: email }]
    });
      if (!user) {
          user = await User.create({
              googleId: id,
              email,
              name,
              avatar: picture,
          });
      }

      // ✅ Generate JWT Token
      const jwtToken = jwt.sign(
          { googleId: user.googleId, email: user.email, name: user.name, avatar: user.avatar },
          process.env.JWT_SECRET,  // Use a secure secret key
          { expiresIn: "7d" } // Token expires in 7 days
      );
    
      res.json({ token: jwtToken, user });
      console.log("Zajjjajj",jwtToken);
  } catch (err) {
      console.error("Google Authentication Error:", err.response?.data || err.message); // Debugging
      res.status(400).json({ error: "Invalid Google Token" });
  }
});
  router.get("/user", authenticateJWT,async (req, res) => {
    try{
    res.json(req.user);
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  });
// Logout
router.post("/logout", async (req, res) => {
    try {
      res.json({ message: "Logout successful. Delete token on client-side." });
      } catch (err) {
        console.error("❌ Logout Error:", err);
        res.status(500).json({ error: "Server error" });
      }
    });
  
export default router;
