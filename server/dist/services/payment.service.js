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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const db_1 = __importDefault(require("../config/db"));
const errorHandler_1 = require("../middlewares/errorHandler");
class PaymentService {
    createPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate rental exists
                const rental = yield db_1.default.rental.findUnique({
                    where: { id: data.rentalId }
                });
                if (!rental) {
                    throw (0, errorHandler_1.createError)('Rental not found', 404);
                }
                // Check if payment already exists for this rental
                const existingPayment = yield db_1.default.payment.findUnique({
                    where: { rentalId: data.rentalId }
                });
                if (existingPayment) {
                    throw (0, errorHandler_1.createError)('Payment already exists for this rental', 409);
                }
                // Validate amount
                if (data.amount <= 0) {
                    throw (0, errorHandler_1.createError)('Payment amount must be greater than 0', 400);
                }
                // Validate method
                if (!data.method || data.method.trim().length === 0) {
                    throw (0, errorHandler_1.createError)('Payment method is required', 400);
                }
                const payment = yield db_1.default.payment.create({
                    data: {
                        rentalId: data.rentalId,
                        amount: data.amount,
                        paymentDate: data.paymentDate,
                        method: data.method.trim()
                    },
                    include: {
                        rental: {
                            select: {
                                id: true,
                                userId: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        }
                    }
                });
                return payment;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to create payment', 500);
            }
        });
    }
    getAllPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payments = yield db_1.default.payment.findMany({
                    include: {
                        rental: {
                            select: {
                                id: true,
                                userId: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        }
                    },
                    orderBy: {
                        paymentDate: 'desc'
                    }
                });
                return payments;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch payments', 500);
            }
        });
    }
    getPaymentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield db_1.default.payment.findUnique({
                    where: { id },
                    include: {
                        rental: {
                            select: {
                                id: true,
                                userId: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        }
                    }
                });
                if (!payment) {
                    throw (0, errorHandler_1.createError)('Payment not found', 404);
                }
                return payment;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch payment', 500);
            }
        });
    }
    getPaymentByRentalId(rentalId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield db_1.default.payment.findUnique({
                    where: { rentalId },
                    include: {
                        rental: {
                            select: {
                                id: true,
                                userId: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        }
                    }
                });
                return payment;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch payment', 500);
            }
        });
    }
    updatePayment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingPayment = yield db_1.default.payment.findUnique({
                    where: { id }
                });
                if (!existingPayment) {
                    throw (0, errorHandler_1.createError)('Payment not found', 404);
                }
                if (data.amount !== undefined && data.amount <= 0) {
                    throw (0, errorHandler_1.createError)('Payment amount must be greater than 0', 400);
                }
                if (data.method && data.method.trim().length === 0) {
                    throw (0, errorHandler_1.createError)('Payment method cannot be empty', 400);
                }
                const updateData = {};
                if (data.amount !== undefined)
                    updateData.amount = data.amount;
                if (data.paymentDate)
                    updateData.paymentDate = data.paymentDate;
                if (data.method)
                    updateData.method = data.method.trim();
                const payment = yield db_1.default.payment.update({
                    where: { id },
                    data: updateData,
                    include: {
                        rental: {
                            select: {
                                id: true,
                                userId: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        }
                    }
                });
                return payment;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to update payment', 500);
            }
        });
    }
    deletePayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingPayment = yield db_1.default.payment.findUnique({
                    where: { id }
                });
                if (!existingPayment) {
                    throw (0, errorHandler_1.createError)('Payment not found', 404);
                }
                yield db_1.default.payment.delete({
                    where: { id }
                });
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to delete payment', 500);
            }
        });
    }
}
exports.PaymentService = PaymentService;
