import { Router } from 'express';
import { getCars, addCar, updateCar, updateCarStatus, deleteCar, getCarById } from '../controllers/carController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/')
  .get(getCars)
  .post(protect, addCar);

router.route('/:id')
  .get(getCarById) 
  .patch(protect, updateCar)
  .put(protect, updateCarStatus)
  .delete(protect, deleteCar);

export default router;
