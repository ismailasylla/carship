import { Router } from 'express';
import { getCars, addCar, updateCarStatus, deleteCar } from '../controllers/carController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/')
  .get(getCars)
  .post(protect, addCar);

router.route('/:id')
  .patch(protect, updateCarStatus)
  .delete(protect, deleteCar);

export default router;
