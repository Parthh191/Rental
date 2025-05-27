"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rental_controller_1 = require("../controllers/rental.controller");
const router = (0, express_1.Router)();
// POST /api/rentals - Create a new rental
router.post('/', rental_controller_1.createRental);
// GET /api/rentals - Get all rentals
router.get('/', rental_controller_1.getAllRentals);
// GET /api/rentals/:id - Get rental by ID
router.get('/:id', rental_controller_1.getRentalById);
// GET /api/rentals/user/:userId - Get rentals by user ID
router.get('/user/:userId', rental_controller_1.getRentalsByUserId);
// PUT /api/rentals/:id - Update rental by ID
router.put('/:id', rental_controller_1.updateRental);
// DELETE /api/rentals/:id - Delete rental by ID
router.delete('/:id', rental_controller_1.deleteRental);
exports.default = router;
