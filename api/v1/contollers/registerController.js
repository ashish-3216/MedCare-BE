import express from 'express';
import { insertUser } from '../services/registerService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await insertUser(req.body);
    if (result.success) {
      console.log('User added successfully');
      res.status(200).json({ success: true, message : "login successful" });
    } else {
      console.error('Failed to add user:', result.message);
      res.status(400).send(result.message);
    }
  } catch (err) {
    console.error('Error in API controller:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
