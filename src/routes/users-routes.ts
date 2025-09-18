import express from 'express';
import { authenticateToken } from '../middlewares/auth';
import { getUser, getUsers, blockUser } from '../controllers/users-controller';

const router = express.Router();

router.get('/user/:id', authenticateToken, getUser);

router.get('/users', authenticateToken, getUsers);

router.put('/user/:id/block', authenticateToken, blockUser)

export default router;