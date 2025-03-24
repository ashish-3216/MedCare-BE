import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "../../db/config.js";
import bcrypt from "bcrypt"
import LocalStrategy from "passport-local";
dotenv.config();

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    console.log("Local Strategy Invoked with:", email);

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
        console.log("Password matched");
        return done(null, user);
      } else {
        console.log("Password did not match");
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (error) {
      console.error("Error in Local Strategy:", error);
      return done(error);
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
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await pool.query(`select * from users where email_id = $1 `, [
    id,
  ]);
  done(null, user);
});
export default passport;
