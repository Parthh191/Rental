"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.getPaymentByRentalId = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const payment_service_1 = require("../services/payment.service");
const paymentService = new payment_service_1.PaymentService();
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = Object.assign(Object.assign({}, req.body), { paymentDate: new Date(req.body.paymentDate) });
        const payment = yield paymentService.createPayment(paymentData);
        res.status(201).json({
            success: true,
            data: payment,
            message: 'Payment created successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createPayment = createPayment;
const getAllPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield paymentService.getAllPayments();
        res.status(200).json({
            success: true,
            data: payments,
            count: payments.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPayments = getAllPayments;
const getPaymentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid payment ID' }
            });
            return;
        }
        const payment = yield paymentService.getPaymentById(id);
        res.status(200).json({
            success: true,
            data: payment
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPaymentById = getPaymentById;
const getPaymentByRentalId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rentalId = parseInt(req.params.rentalId);
        if (isNaN(rentalId)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid rental ID' }
            });
            return;
        }
        const payment = yield paymentService.getPaymentByRentalId(rentalId);
        res.status(200).json({
            success: true,
            data: payment
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getPaymentByRentalId = getPaymentByRentalId;
const updatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid payment ID' }
            });
            return;
        }
        const updateData = Object.assign({}, req.body);
        if (updateData.paymentDate) {
            updateData.paymentDate = new Date(updateData.paymentDate);
        }
        const payment = yield paymentService.updatePayment(id, updateData);
        res.status(200).json({
            success: true,
            data: payment,
            message: 'Payment updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid payment ID' }
            });
            return;
        }
        yield paymentService.deletePayment(id);
        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePayment = deletePayment;
