import express from "express";
import passport from "passport";

const router = express.Router();


router.post("/login", (req, res, next) => {
  //login logic
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success : false ,error: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ success : false , error: info?.message || "Invalid credentials" });
    }
    req.login(user, (loginErr) => {

      req.session.user = {
        id: user.id,
        username: user.username,
        email_id: user.email_id,
        role: user.role
      };
      
      if (loginErr) {
        return res.status(500).json({ success : false , error: "Login failed" });
      }
      return res.status(200).json({ success : true , message: "Login successful"});
    });
  })(req, res, next);
});

router.get("/status", (req, res) => {
  // console.log("Session:", req.session);
  // console.log("Authenticated:", req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  } else {
    return res.status(401).json({ authenticated: false });
  }
});

router.post("/logout", (req, res) => {
  req.logout(()=>{
      req.session.destroy() ;
      res.clearCookie('connect.sid') ;
      res.send('logout successfull');
      console.log('logout Successfull');
  })
});


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("https://med-care-eta.vercel.app/");
});


export default router;
