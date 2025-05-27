import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByItemId,
  getReviewsByUserId,
  updateReview,
  deleteReview
} from '../controllers/review.controller';

const router = Router();

// POST /api/reviews - Create a new review
router.post('/', createReview);

// GET /api/reviews - Get all reviews
router.get('/', getAllReviews);

// GET /api/reviews/item/:itemId - Get reviews by item ID (must come before /:id)
router.get('/item/:itemId', getReviewsByItemId);

// GET /api/reviews/user/:userId - Get reviews by user ID (must come before /:id)
router.get('/user/:userId', getReviewsByUserId);

// GET /api/reviews/:id - Get review by ID
router.get('/:id', getReviewById);

// PUT /api/reviews/:id - Update review by ID
router.put('/:id', updateReview);

// DELETE /api/reviews/:id - Delete review by ID
router.delete('/:id', deleteReview);

export default router;