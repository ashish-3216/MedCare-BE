import express from 'express'
import doctorController from './contollers/doctorController.js'
import authRoutes from './Routes/auth-routes.js';
import registerController from './contollers/registerController.js';
const router = express.Router() ;
router.use('/doctor',doctorController);
router.use('/register',registerController);
router.use('/auth',authRoutes);
export default router ;