import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passportSetup from "./api/v1/services/passportService.js";
import passport from "passport";
import cookieSession from "cookie-session";
import bodyParser from 'body-parser';
import api from "./api/index.js";
import session from "express-session";

dotenv.config();
const app = express();
app.use(
  session({
    secret: process.env.cookieKey || "fallbackSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,             // ✅ Required for HTTPS domains like Render
      sameSite: "none",         // ✅ Required for cross-origin cookie over HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Optional: 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002" , "http://localhost:3003",],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);

app.get('/debug-session', (req, res) => {
  res.json({
    session: req.session,
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});

app.listen(process.env.serverPort, () => {
  console.log("Successfully BackEnd Server Running", process.env.serverPort);
});



