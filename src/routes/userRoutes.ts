import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController'; // Adjust the path as needed

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
