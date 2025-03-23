import express from 'express'
import { getDoctorById, getDoctors } from '../services/doctorService.js'

const router = express.Router() ;

router.get('/', async (req,res)=>{
    try{
        const response = await getDoctors() ;
        if(!response.success) throw new Error("error in get api") ;
        return res.status(200).send( {data : response.data} );
    }catch(err){
        return res.status(400).send({message : err.message || ""});
    }
});
router.get('/:id',async(req,res)=>{
    try{
        const {id} = req.params ;
        const response = await getDoctorById(id) ;
        if(response.success) return  res.status(200).send({data : response.data});
    }catch(err){
        return res.status(400).send({message : err.message || ""});
    }
});
export default router ;