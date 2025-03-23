import express from 'express'
import v1 from './v1/index.js'
const router = express.Router() ;

router.use('/v1',v1);
router.get('/',(req,res)=>{
    res.send("welcome to api");
})
export default router ;