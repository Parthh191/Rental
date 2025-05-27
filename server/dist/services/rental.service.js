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
exports.RentalService = void 0;
const db_1 = __importDefault(require("../config/db"));
const prisma_1 = require("../../generated/prisma");
const errorHandler_1 = require("../middlewares/errorHandler");
class RentalService {
    createRental(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate dates
                if (new Date(data.startDate) >= new Date(data.endDate)) {
                    throw (0, errorHandler_1.createError)('Start date must be before end date', 400);
                }
                if (new Date(data.startDate) < new Date()) {
                    throw (0, errorHandler_1.createError)('Start date cannot be in the past', 400);
                }
                // Check if user exists
                const userExists = yield db_1.default.user.findUnique({
                    where: { id: data.userId }
                });
                if (!userExists) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                // Check if item exists and is available
                const item = yield db_1.default.item.findUnique({
                    where: { id: data.itemId }
                });
                if (!item) {
                    throw (0, errorHandler_1.createError)('Item not found', 404);
                }
                if (!item.available) {
                    throw (0, errorHandler_1.createError)('Item is not available for rental', 400);
                }
                // Check for conflicting rentals
                const conflictingRental = yield db_1.default.rental.findFirst({
                    where: {
                        itemId: data.itemId,
                        status: {
                            in: [prisma_1.RentalStatus.PENDING, prisma_1.RentalStatus.APPROVED]
                        },
                        OR: [
                            {
                                startDate: {
                                    lte: data.endDate
                                },
                                endDate: {
                                    gte: data.startDate
                                }
                            }
                        ]
                    }
                });
                if (conflictingRental) {
                    throw (0, errorHandler_1.createError)('Item is already rented during this period', 409);
                }
                const rental = yield db_1.default.rental.create({
                    data: {
                        userId: data.userId,
                        itemId: data.itemId,
                        startDate: data.startDate,
                        endDate: data.endDate
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                pricePerDay: true
                            }
                        },
                        payment: true
                    }
                });
                return rental;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to create rental', 500);
            }
        });
    }
    getAllRentals() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rentals = yield db_1.default.rental.findMany({
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                pricePerDay: true
                            }
                        },
                        payment: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return rentals;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch rentals', 500);
            }
        });
    }
    getRentalById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rental = yield db_1.default.rental.findUnique({
                    where: { id },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                pricePerDay: true
                            }
                        },
                        payment: true
                    }
                });
                if (!rental) {
                    throw (0, errorHandler_1.createError)('Rental not found', 404);
                }
                return rental;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch rental', 500);
            }
        });
    }
    getRentalsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield db_1.default.user.findUnique({
                    where: { id: userId }
                });
                if (!userExists) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                const rentals = yield db_1.default.rental.findMany({
                    where: { userId },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                pricePerDay: true
                            }
                        },
                        payment: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return rentals;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch user rentals', 500);
            }
        });
    }
    updateRental(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRental = yield db_1.default.rental.findUnique({
                    where: { id }
                });
                if (!existingRental) {
                    throw (0, errorHandler_1.createError)('Rental not found', 404);
                }
                // Validate dates if provided
                if (data.startDate || data.endDate) {
                    const startDate = data.startDate || existingRental.startDate;
                    const endDate = data.endDate || existingRental.endDate;
                    if (new Date(startDate) >= new Date(endDate)) {
                        throw (0, errorHandler_1.createError)('Start date must be before end date', 400);
                    }
                }
                const rental = yield db_1.default.rental.update({
                    where: { id },
                    data,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                pricePerDay: true
                            }
                        },
                        payment: true
                    }
                });
                return rental;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to update rental', 500);
            }
        });
    }
    deleteRental(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRental = yield db_1.default.rental.findUnique({
                    where: { id }
                });
                if (!existingRental) {
                    throw (0, errorHandler_1.createError)('Rental not found', 404);
                }
                yield db_1.default.rental.delete({
                    where: { id }
                });
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to delete rental', 500);
            }
        });
    }
}
exports.RentalService = RentalService;
