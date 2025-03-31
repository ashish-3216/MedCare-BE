import express from "express";
import pool from "../../db/config.js";

export const submitAppointment = async (data) => {
  try {
    const {
      user_email,
      doctor_id,
      appointment_time,
      location,
      type,
      appointment_date,
    } = data;
    const status = "Pending"; // Default status for approval
    // Check if the user already has an appointment at the same time
    const existingAppointment = await pool.query(
      `SELECT * FROM appointments 
           WHERE user_email = $1 
           AND appointment_time = $2 
           AND appointment_date = $3`,
      [user_email, appointment_time, appointment_date]
    );

    if (existingAppointment.rows.length > 0) {
      return {
        success: false,
        message: "You already have an appointment booked at this time.",
      };
    }
    const check = await pool.query(
      `INSERT INTO appointments (user_email, doctor_id, appointment_time, location, type, status , appointment_date) 
         VALUES ($1, $2, $3, $4, $5, $6 , $7)`,
      [
        user_email,
        doctor_id,
        appointment_time,
        location,
        type,
        status,
        appointment_date,
      ]
    );

    console.log("Appointment booked");
    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (err) {
    console.error("Database Error:", err);
    return {
      success: false,
      message: "Can't book appointment right now",
    };
  }
};


export const declineAppointment = async (id) => {
  try {
    const result = await pool.query(
      `UPDATE appointments SET status = $1 
       WHERE id = $2`,
      ["decline", id]
    );
    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Appointment not found or already approved.",
      };
    }
    console.log("Appointment Declined");
    return {
      success: true,
      message: "Appointment declined successfully",
    };
  } catch (err) {
    console.log("Error in Controller api");
    return {
      success: false,
      message: "Error in Controller api",
    };
  }
};

export const updateSameTimeAppointments = async (date, time, doctor_id) => {
  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET status = $1 
       WHERE appointment_date = $2 
         AND appointment_time = $3 
         AND status = $4 
         AND doctor_id = $5
       RETURNING *`,
      ["declined", date, time, "Pending", doctor_id]
    );

    if (result.rowCount === 0) {
      console.log("No other pending appointments found on the given date and time.");
      return {
        success: true, // ✅ Treat this as success, not failure
        message: "No other pending appointments to decline.",
      };
    }

    console.log(`${result.rowCount} appointment(s) updated to declined.`);
    return {
      success: true,
      message: `${result.rowCount} appointment(s) updated to declined.`,
    };
  } catch (err) {
    console.error("Database Error:", err);
    return {
      success: false,
      message: "Can't update appointments right now.",
    };
  }
};


export const getDetails = async (doctor_id, appointment_date) => {
  try {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND status = $3 `,
      [doctor_id, appointment_date, "approved"]
    );

    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.error("Database Error:", err);
    return {
      success: false,
      message: "Database error or unable to find details",
    };
  }
};

export const retrieveAppointments = async () => {
  try {
    const result = await pool.query(
      `SELECT a.*, b.username, c.doc_name
        FROM APPOINTMENTS AS a
        JOIN users AS b ON b.email_id = a.user_email
        JOIN doctors AS c ON a.doctor_id = c.id ORDER BY appointment_date DESC`,
      []
    );
    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.error("Database Error : ", err);
    return {
      success: false,
      message: "Database error or unable to find details",
    };
  }
};
export const approveAppointment = async (id) => {
  try {
    const result = await pool.query(
      `Update appointments set status = $2 where id = $1`,
      [id, "approved"]
    );
    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Appointment not found or already approved.",
      };
    }
    console.log("Appointment Confirmed");
    return {
      success: true,
      message: "Appointment Confirmed",
    };
  } catch (err) {
    console.error("Database Error:", err);
    return {
      success: false,
      message: "Can't approve appointment right now",
    };
  }
};
export const retrieveUserAppointments = async (userId ) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.doc_name , c.specialization  
        FROM APPOINTMENTS AS a
        JOIN doctors AS c ON a.doctor_id = c.id
        where user_email = $1`,
      [userId]
    );
    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.error("Database Error : ", err);
    return {
      success: false,
      message: "Database error or unable to find details",
    };
  }
};
