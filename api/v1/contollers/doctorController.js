import express from "express";
import {
  getDoctorById,
  getDoctors,
  addDoctor,
  deleteDoctor,
} from "../services/doctorService.js";
import { authenticateUser } from "../middleware/middleware.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await getDoctors();
    if (!response.success) throw new Error("error in get api");
    return res.status(200).send({ data: response.data });
  } catch (err) {
    return res.status(400).send({ message: err.message || "" });
  }
});
router.get("/:id",async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getDoctorById(id);
    if (response.success) return res.status(200).send({ data: response.data });
  } catch (err) {
    return res.status(400).send({ message: err.message || "" });
  }
});
export default router;


router.post("/add",async (req, res) => {
  try {
    const result = await addDoctor(req.body);
    if (result.success) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Added Doctor successfully",
          data: result.data,
        });
    } else {
      console.error("Failed to Add Doctor:", result.message);
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in API controller:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.delete("/delete",async (req, res) => {
  try {
    const { id } = req.body;
    const result = await deleteDoctor(id);
    if (result.success) {
      return res
        .status(200)
        .json({ success: true, message: "Deleted Doctor successfully" });
    } else {
      console.error("Failed to Delete Doctor:", result.message);
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error in API controller:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});
