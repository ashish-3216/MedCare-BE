import {
  submitAppointment,
  approveAppointment,
  updateSameTimeAppointments,
  declineAppointment,
  getDetails,
  retrieveAppointments,
  retrieveUserAppointments
} from "../services/appointmentService.js";
import express from "express";
import { authenticateUser } from "../middleware/middleware.js";
import sendMail from "../services/mailService.js";
const router = express.Router();
//
router.post("/",  authenticateUser , async (req, res) => {
  try {
    const user_email = req.user_email; // Access from middleware
    const { doctor_id, appointment_time, appointment_date ,location, type } = req.body;

    const result = await submitAppointment({
      appointment_date,
      user_email,
      doctor_id,
      appointment_time,
      location,
      type,
    });

    if (result.success) {
      return res
        .status(200)
        .json({ success: true, message: "Appointment booked successfully" });
    } else {
      console.error("Failed to book appointment:", result.message);
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in API controller:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/approve", async (req, res) => {
  try {
    console.log(req.body);
    const { id, appointment_time ,appointment_date,doctor_id , user_email , doc_name } = req.body;
    const result = await approveAppointment(id);
    if (result.success) {
      const response = await updateSameTimeAppointments(appointment_date,appointment_time,doctor_id);
      if (response.success) {
        await sendMail(user_email, "Appointment Approved", 
          `Your appointment on ${appointment_date} at ${appointment_time} with doctor ${doc_name} has been approved.`
        );
        return res.status(200).json({
          success: true,
          message: "Appointment approved successfully",
        });
      } else {
        console.error("Failed to approve appointment:", response.message);
        return res
          .status(400)
          .json({ success: false, message: response.message });
      }
    }else{
      console.error("Failed to approve appointment:", result.message);
        return res
          .status(400)
          .json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in API controller:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.post('/decline',async (req,res)=>{
  try{
    const {id} = req.body ;
  const result = await declineAppointment(id) ;
  if(result.success){
    res.status(200).json({success : true , message : "Appointment Declined"});
  }else{
    res.status(400).json({success : false , message : 'Appointment not declined'});
  }
  }catch(err){
    console.error("Error in API controller:", err.message);
    res.status(500).json({success : false , message : 'Appointment not declined || internal server error'});
  }
  
})

router.post('/details',async (req,res)=>{
  try{
    const {doc_id , appointment_date} = req.body ;
    const doctor_id = parseInt(doc_id) ;
    const result = await getDetails(doctor_id,appointment_date) ;
    if(result.success){
      res.status(200).json(
        {
          success : true,
          data : result.data
        }
      )
    }else{
      throw new Error('error in get api')
    }
  }catch(err){
    return res.status(500).json({message : err.message});
  }
})

router.get('/appointments',async (req,res)=>{
  try{
    const result = await  retrieveAppointments() ;
    if(result.success){
      res.status(200).json(
        {
          success : true ,
          data : result.data,
        }
      )
    }else throw new Error('error in get api'); 
  }catch(err){
    return res.status(500).json({message : err.message});
  }
})
router.get('/user',async (req,res)=>{
  try{
    const userId = req.query.user_email;
    const result = await retrieveUserAppointments(userId) ;
    if(result.success){
      res.status(200).json(
        {
          success : true ,
          data : result.data,
        }
      )
    }else throw new Error('error in get api'); 
  }catch(err){
    return res.status(500).json({message : err.message});
  }
})



export default router;
