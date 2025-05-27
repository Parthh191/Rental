"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
// POST /api/payments - Create a new payment
router.post('/', payment_controller_1.createPayment);
// GET /api/payments - Get all payments
router.get('/', payment_controller_1.getAllPayments);
// GET /api/payments/:id - Get payment by ID
router.get('/:id', payment_controller_1.getPaymentById);
// GET /api/payments/rental/:rentalId - Get payment by rental ID
router.get('/rental/:rentalId', payment_controller_1.getPaymentByRentalId);
// PUT /api/payments/:id - Update payment by ID
router.put('/:id', payment_controller_1.updatePayment);
// DELETE /api/payments/:id - Delete payment by ID
router.delete('/:id', payment_controller_1.deletePayment);
exports.default = router;
