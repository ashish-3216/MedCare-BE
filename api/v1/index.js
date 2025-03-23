import express from 'express'
import doctorController from './contollers/doctorController.js'
const router = express.Router() ;
router.use('/doctor',doctorController);
export default router ;