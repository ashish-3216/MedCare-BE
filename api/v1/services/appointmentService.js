import express from "express";
import pool from "../../db/config.js";
export const submitAppointment = async (data) => {
  try {
    const { user_email, doctor_id, appointment_time, location, type } = data;
    const status = "Pending"; // Default status for approval

    const check = await pool.query(
      `INSERT INTO appointments (user_email, doctor_id, appointment_date, location, type, status) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_email, doctor_id, appointment_time, location, type, status]
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

export const updateSameTimeAppointments = async (date) => {
  try {
    const result = await pool.query(
      `UPDATE appointments SET status = $1 
       WHERE appointment_date = $2 AND status = $3`,
      ["declined", date, "Pending"]
    );

    if (result.rowCount === 0) {
      console.log("No pending appointments found on the given date.");
      return {
        success: false,
        message: "No pending appointments found for the given date.",
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
