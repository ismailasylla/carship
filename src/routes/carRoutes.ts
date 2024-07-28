import express from 'express';
import { getCars, createCar, updateCar, deleteCar, getCarById, getFilterOptions } from '../controllers/carController';

const router = express.Router();

router.route('/filters')
  .get(getFilterOptions);

router.route('/')
  .get(getCars)
  .post(createCar);

router.route('/:id')
  .get(getCarById)
  .put(updateCar)
  .delete(deleteCar);

export default router;
