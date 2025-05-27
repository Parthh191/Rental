"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)();
// POST /api/reviews - Create a new review
router.post('/', review_controller_1.createReview);
// GET /api/reviews - Get all reviews
router.get('/', review_controller_1.getAllReviews);
// GET /api/reviews/:id - Get review by ID
router.get('/:id', review_controller_1.getReviewById);
// GET /api/reviews/item/:itemId - Get reviews by item ID
router.get('/item/:itemId', review_controller_1.getReviewsByItemId);
// GET /api/reviews/user/:userId - Get reviews by user ID
router.get('/user/:userId', review_controller_1.getReviewsByUserId);
// PUT /api/reviews/:id - Update review by ID
router.put('/:id', review_controller_1.updateReview);
// DELETE /api/reviews/:id - Delete review by ID
router.delete('/:id', review_controller_1.deleteReview);
exports.default = router;
