import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "../../db/config.js";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
dotenv.config();

passport.use(
  new LocalStrategy({ 
    usernameField: "email",
    // Add this to access request body
    passReqToCallback: true 
  }, async function (req, email, password, done) {
    console.log("Local Strategy Invoked with:", email);
    
    // Now you can access AdminFlag from the request body
    const AdminFlag = req.body.AdminFlag;
    console.log("Admin Flag:", AdminFlag);

    try {
      const query = `SELECT * FROM users WHERE email_id = $1`;
      const resp = await pool.query(query, [email]);

      if (resp.rows.length === 0) {
        console.log("User not found");
        return done(null, false, { message: "Incorrect email." });
      }

      const user = resp.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        if (AdminFlag) {
          if (user.role == "admin") {
            console.log("Password matched and is admin");
            return done(null, user);
          } else {
            return done(null, false, { message: "This User is not Admin" });
          }
        } else {
          console.log("Password matched");
          return done(null, user);
        }
      } else {
        console.log("Password did not match");
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (error) {
      console.error("Error in Local Strategy:", error);
      return done(error, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.GoogleCallback,
      clientID: process.env.GoogleClientID,
      clientSecret: process.env.GoogleClientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile._json.email;
      const result = await pool.query(
        `select * from users where email_id = $1 `,
        [email]
      );
      if (result.rowCount === 0) {
        const user = await pool.query(
          `INSERT INTO USERS (username , email_id ) values ($1,$2) returning *`,
          [profile.displayName, email]
        );
        done(null, user.rows[0]);
      } else {
        done(null, result.rows[0]);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing User:", user.email_id);
  done(null, user.email_id);
});

passport.deserializeUser(async (email_id, done) => {
  console.log("Deserializing User with email:", email_id);
  try {
    const user = await pool.query(`SELECT * FROM users WHERE email_id = $1`, [
      email_id,
    ]);
    if (user.rowCount === 0) {
      console.log("User Not Found in DB");
      return done(null, false);
    }
    console.log("User Found:", user.rows[0]);
    done(null, user.rows[0]);
  } catch (error) {
    console.error("Error in Deserialization:", error);
    done(error);
  }
});

export default passport;
