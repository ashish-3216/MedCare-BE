import express from "express";
import passport from "passport";
import {ensureAuthenticated} from "../middleware/middleware.js";
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
      if (loginErr) {
        return res.status(500).json({ success : false , error: "Login failed" });
      }
      return res.status(200).json({ success : true , message: "Login successful"});
    });
  })(req, res, next);
});

// router.post("/login", (req, res, next) => {
//   // Extract portal information from request
//   const { email, password, portal } = req.body;
  
//   // Log which portal is making the request
//   console.log(`Login attempt from portal: ${portal}`);
  
//   // Standard passport authentication
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
//     if (!user) {
//       return res.status(401).json({ success: false, error: info?.message || "Invalid credentials" });
//     }
    
//     // Role-based access check based on portal
//     if (portal === 'admin' && user.role !== 'admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: "Access denied. Admin privileges required for this portal." 
//       });
//     }
    
//     if (portal === 'user' && user.role !== 'user') {
//       return res.status(403).json({ 
//         success: false, 
//         error: "Access denied. Doctor privileges required for this portal." 
//       });
//     }
    
//     // If role check passes, complete the login
//     req.login(user, (loginErr) => {
//       if (loginErr) {
//         return res.status(500).json({ success: false, error: "Login failed" });
//       }
      
//       return res.status(200).json({ 
//         success: true, 
//         message: "Login successful",
//         user: {
//           email: user.email_id,
//           username: user.username,
//           role: user.role
//         }
//       });
//     });
//   })(req, res, next);
// });

router.get('/status',(req,res)=>{
  if(req.isAuthenticated()){
    res.json({authenticated : true , user : req.user});
  }else{
    res.status(401).json({authenticated:false } );
  }
})

router.post("/logout", (req, res) => {
  req.logout(()=>{
      req.session.destroy() ;
      res.clearCookie('connect.sid') ;
      res.send('logout successfull');
      console.log('logout Successfull');
  })
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Proceed to the requested route
  }
  res.status(401).json({ message: 'Unauthorized, please log in.' }); // Or redirect to login page
};

// Apply middleware to protect the appointment route
router.get('/appointment', ensureAuthenticated, (req, res) => {
  res.json({ message: `Welcome to your appointment, ${req.user.email}` });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("http://localhost:3000/");
});
export default router;
