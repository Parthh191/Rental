import { Router } from 'express';
import {
  createRental,
  getAllRentals,
  getRentalById,
  getRentalsByUserId,
  updateRental,
  deleteRental
} from '../controllers/rental.controller';

const router = Router();

// POST /api/rentals - Create a new rental
router.post('/', createRental);

// GET /api/rentals - Get all rentals
router.get('/', getAllRentals);

// GET /api/rentals/user/:userId - Get rentals by user ID (must come before /:id)
router.get('/user/:userId', getRentalsByUserId);

// GET /api/rentals/:id - Get rental by ID
router.get('/:id', getRentalById);

// PUT /api/rentals/:id - Update rental by ID
router.put('/:id', updateRental);

// DELETE /api/rentals/:id - Delete rental by ID
router.delete('/:id', deleteRental);

export default router;