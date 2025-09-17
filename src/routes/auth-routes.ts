import express from 'express';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/protected', authenticateToken, (req,res) => {
    res.json({ message: 'You have accessed the protected route!', userId: req.userId });
})
export default router;
