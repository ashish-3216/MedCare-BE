import express from "express";
import pool from "../../db/config.js";
export const submitAppointment = async (data) => {
  try {
    const { user_email, doctor_id, appointment_time, location, type ,appointment_date } = data;
    const status = "Pending"; // Default status for approval

    const check = await pool.query(
      `INSERT INTO appointments (user_email, doctor_id, appointment_time, location, type, status , appointment_date) 
         VALUES ($1, $2, $3, $4, $5, $6 , $7)`,
      [user_email, doctor_id, appointment_time, location, type, status , appointment_date]
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
export const declineAppointment = async (id) => {
  try{
    const result = await pool.query(
      `UPDATE appointments SET status = $1 
       WHERE id = $2`,
      ["Pending",id]
    );
    if(result.rowCount === 0){
      return{
        success : false ,
        message: "Appointment not found or already approved.",
      }
    }
    console.log('Appointment Declined') ;
    return{
      success : true ,
      message : 'Appointment declined successfully'
    }
  }catch(err){
    console.log('Error in Controller api');
    return{
      success : false,
      message : 'Error in Controller api'
    }
  }
}
export const updateSameTimeAppointments = async (date,time,doctor_id) => {
  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET status = $1 
       WHERE appointment_date = $2 
         AND appointment_time = $3 
         AND status = $4 
         AND doctor_id = $5
       RETURNING *`,
      ["declined", date, time, "Pending",doctor_id]
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
// export const updateSameTimeAppointments = async ( date, time , doc_id) => {
//   try {
//     console.log("Updating with:", { date, time });

//     const result = await pool.query(
//       `UPDATE appointments 
//        SET status = $1 
//        WHERE appointment_date = $2 
//          AND appointment_time = $3 
//          AND status = $4
//          AND doctor_id = $5
//        RETURNING *`,
//       ["declined", date, time, "Pending", doc_id]
//     );
//     console.log(`UPDATE appointments SET status = 'declined' WHERE appointment_date = '${date}' AND appointment_time = '${time}' AND status = 'Pending' AND doctor_id = '${doc_id}'`);
//     if (result.rowCount === 0) {
//       console.log("No pending appointments found on the given date and time.");
//       return {
//         success: false,
//         message: "No pending appointments found for the given date and time.",
//       };
//     }

//     console.log(`${result.rowCount} appointment(s) updated to declined.`);
//     return {
//       success: true,
//       message: `${result.rowCount} appointment(s) updated to declined.`,
//     };
//   } catch (err) {
//     console.error("Database Error:", err);
//     return {
//       success: false,
//       message: "Can't update appointments right now.",
//     };
//   }
// };
export const getDetails = async ({ doc_id , date })=>{
  try{
    const result = await pool.query(
      `SELECT * FROM APPOINTMENTS where doctor_id = $1 AND appointment_date = $2`,
      [doc_id,date]
    );
    return {
      success: true,
      data: result.rows,
    };
  }catch(err){
    console.log('db error')
    return{
      success : false ,
      message : 'can find or DataBase error' 
    }
  }
}