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
router.post('/register',async(req,res)=>{
  const {email,password,name} = req.body;
  const uniqueString = randString();
  const isVerified = false;
  const saltRounds = 10;
  let user = await User.findOne({ email: email });

  if(!user){
    user = await User.create({
      isVerified,
      verificationCode:uniqueString,
      ...req.body
    });
    sendEmail(email,uniqueString);
    res.json(user);
  }
  res.status(400).json('This Email is Already Registerd');
  
})

router.get('/verify/:verificationCode', async (req, res) => {
  const { verificationCode } = req.params;

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

  
export default router;
