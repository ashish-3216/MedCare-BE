import express from 'express'
import { getReviews,addReview } from "../services/reviewService.js";
const router = express.Router();

router.get('/',async (req,res)=>{
    try{
        const result = await getReviews() ;
        if(!result.success) throw new Error('error in get api') ;
        if(result.success){
            res.status(200).send({data  : result.data})
        }
    }catch(err){
        return res.status(400).send({ message: err.message || "" });
    }
})

router.post("/add", async (req, res) => {
  try {
    const result = await addReview(req.body);
    if (result.success) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Added Review successfully",
          data: result.data,
        });
    } else {
      console.error("Failed to Add Review:", result.message);
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