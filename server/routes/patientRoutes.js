import express from 'express';
import { body } from 'express-validator';
import { getPatients, createPatient, updatePatient, deletePatient } from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', getPatients);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('primaryCondition').notEmpty().withMessage('Primary condition is required'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
  validateRequest,
  createPatient
);

router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
