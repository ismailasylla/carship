import express from 'express';
import { getCars, createCar, updateCar, deleteCar, getFilterOptions } from '../controllers/carController';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(createCar);

router.route('/:id')
  .put(updateCar)
  .delete(deleteCar);

router.route('/filters')
  .get(getFilterOptions);

export default router;
