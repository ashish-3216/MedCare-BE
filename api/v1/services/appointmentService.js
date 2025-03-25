import express from 'express'
import pool from '../../db/config.js';
export const submitAppointment = async (data) => {
    try {
      const { user_email, doctor_id, appointment_time, location, type } = data;
      const status = "pending"; // Default status for approval
  
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
  
export const approveAppointment = async (id)=>{
    try{

    }catch(err){

    }
}