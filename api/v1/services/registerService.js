import pool from "../../db/config.js";
import bcrypt from 'bcrypt';

// Hash password function
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const insertUser = async (data) => {
  try {
    const { username, email, password } = data;
    
    const hashedPassword = await hashPassword(password); // Fix here

    const res = await pool.query(
      `INSERT INTO USERS (username, email_id, password) VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    console.log("User created XD");
    return {
      success: true,
      message: "User data added successfully",
    };
  } catch (err) {
    console.error("Database error:", err);
    return {
      success: false,
      message: err.message || "Error while adding user",
    };
  }
};
