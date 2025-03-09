import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cors from "cors"; 
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js"; 

const app = express();

app.use(express.json());

//CORS
app.use(
    cors({
      origin: "http://localhost:3000", // Allow frontend domain
      credentials: true, // Allow cookies/sessions
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    })
  );

// Middleware
app.use(
    session({
      secret: "QUICKQUIZ",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true },
    })
  );


  app.use((req, res, next) => {
    if (req.session) {
      req.session.save((err) => {
        if (err) {
          console.error("❌ Error saving session:", err);
        }
      });
    }
    next();
  });

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
