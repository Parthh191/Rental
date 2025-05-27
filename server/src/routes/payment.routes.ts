import { Router } from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentByRentalId,
  updatePayment,
  deletePayment
} from '../controllers/payment.controller';

const router = Router();

// POST /api/payments - Create a new payment
router.post('/', createPayment);

// GET /api/payments - Get all payments
router.get('/', getAllPayments);

// GET /api/payments/rental/:rentalId - Get payment by rental ID (must come before /:id)
router.get('/rental/:rentalId', getPaymentByRentalId);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', getPaymentById);

// PUT /api/payments/:id - Update payment by ID
router.put('/:id', updatePayment);

// DELETE /api/payments/:id - Delete payment by ID
router.delete('/:id', deletePayment);

export default router;