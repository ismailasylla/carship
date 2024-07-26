import { Router } from 'express';
import { registerUser, loginUser, verifyToken } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, verifyToken);

export default router;
