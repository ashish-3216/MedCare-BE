import { submitAppointment } from "../services/appointmentService.js";
import express from "express";
import { authenticateUser } from "../middleware/middleware.js";
const router = express.Router();

router.post("/", authenticateUser, async (req, res) => {
    try {
      const user_email = req.user_email; // Access from middleware
      const { doctor_id, appointment_time, location, type } = req.body;
  
      const result = await submitAppointment({
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

export default router;
