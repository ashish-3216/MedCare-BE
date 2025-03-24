import pool from "../../db/config.js";
export const getDoctors = async (req, res) => {
  try {
    const result = await pool.query(`Select * from doctors`, []);
    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    return {
      success: false,
      message: "no data" || err.message,
    };
  }
};

export const getDoctorById = async (data) => {
  try {
    const result = await pool.query(`SELECT * FROM doctors WHERE id = $1`, [
      data,
    ]);
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("error while finding this id");
    return {
      success: false,
      message: "invalid id" || err.message,
    };
  }
};

