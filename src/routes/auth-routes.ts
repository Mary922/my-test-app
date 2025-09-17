import express from 'express';
import { authenticateToken } from '../middlewares/auth';
import { registerUser } from '../controllers/auth-controller';
import bcrypt from 'bcryptjs';
import { Request,Response } from 'express';
import { RoleTypes, User } from '../models/user.model';

const router = express.Router();

router.get('/auth/protected', authenticateToken, (req,res) => {
    res.json({ message: 'You have accessed the protected route!', userId: req.userId });
})

router.post('/register',registerUser);

export default router;