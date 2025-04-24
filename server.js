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


app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type",
    "Authorization",
    "Cache-Control", // Allow Cache-Control header
    "Pragma" ],
  exposedHeaders: ["set-cookie"]
}));

app.set('trust proxy', 1);

// Update your session configuration
app.use(
  session({
    secret: process.env.cookieKey || "fallbackSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true only in production
      sameSite: 'none', // Important for cross-origin
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());



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



