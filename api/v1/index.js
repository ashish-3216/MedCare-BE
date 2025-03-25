import express from 'express'
import doctorController from './contollers/doctorController.js';
import authRoutes from './Routes/auth-routes.js';
import registerController from './contollers/registerController.js';
import appointmentController from './contollers/appointmentController.js';
const router = express.Router() ;
router.use('/doctor',doctorController);
router.use('/register',registerController);
router.use('/auth',authRoutes);
router.use('/bookappointment',appointmentController) ;
export default router ;