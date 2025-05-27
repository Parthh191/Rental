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
exports.ReviewService = void 0;
const db_1 = __importDefault(require("../config/db"));
const errorHandler_1 = require("../middlewares/errorHandler");
class ReviewService {
    createReview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validate user exists
                const userExists = yield db_1.default.user.findUnique({
                    where: { id: data.userId }
                });
                if (!userExists) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                // Validate item exists
                const itemExists = yield db_1.default.item.findUnique({
                    where: { id: data.itemId }
                });
                if (!itemExists) {
                    throw (0, errorHandler_1.createError)('Item not found', 404);
                }
                // Validate rating
                if (data.rating < 1 || data.rating > 5) {
                    throw (0, errorHandler_1.createError)('Rating must be between 1 and 5', 400);
                }
                // Check if user has rented this item
                const userRental = yield db_1.default.rental.findFirst({
                    where: {
                        userId: data.userId,
                        itemId: data.itemId,
                        status: 'COMPLETED'
                    }
                });
                if (!userRental) {
                    throw (0, errorHandler_1.createError)('You can only review items you have rented and completed', 400);
                }
                // Check if user already reviewed this item
                const existingReview = yield db_1.default.review.findFirst({
                    where: {
                        userId: data.userId,
                        itemId: data.itemId
                    }
                });
                if (existingReview) {
                    throw (0, errorHandler_1.createError)('You have already reviewed this item', 409);
                }
                const review = yield db_1.default.review.create({
                    data: {
                        userId: data.userId,
                        itemId: data.itemId,
                        rating: data.rating,
                        comment: (_a = data.comment) === null || _a === void 0 ? void 0 : _a.trim()
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
                        }
                    }
                });
                return review;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to create review', 500);
            }
        });
    }
    getAllReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield db_1.default.review.findMany({
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
                        }
                    },
                    orderBy: {
                        id: 'desc'
                    }
                });
                return reviews;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch reviews', 500);
            }
        });
    }
    getReviewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield db_1.default.review.findUnique({
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
                        }
                    }
                });
                if (!review) {
                    throw (0, errorHandler_1.createError)('Review not found', 404);
                }
                return review;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch review', 500);
            }
        });
    }
    getReviewsByItemId(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemExists = yield db_1.default.item.findUnique({
                    where: { id: itemId }
                });
                if (!itemExists) {
                    throw (0, errorHandler_1.createError)('Item not found', 404);
                }
                const reviews = yield db_1.default.review.findMany({
                    where: { itemId },
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
                        }
                    },
                    orderBy: {
                        id: 'desc'
                    }
                });
                return reviews;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch item reviews', 500);
            }
        });
    }
    getReviewsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield db_1.default.user.findUnique({
                    where: { id: userId }
                });
                if (!userExists) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                const reviews = yield db_1.default.review.findMany({
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
                        }
                    },
                    orderBy: {
                        id: 'desc'
                    }
                });
                return reviews;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch user reviews', 500);
            }
        });
    }
    updateReview(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const existingReview = yield db_1.default.review.findUnique({
                    where: { id }
                });
                if (!existingReview) {
                    throw (0, errorHandler_1.createError)('Review not found', 404);
                }
                if (data.rating && (data.rating < 1 || data.rating > 5)) {
                    throw (0, errorHandler_1.createError)('Rating must be between 1 and 5', 400);
                }
                const updateData = {};
                if (data.rating)
                    updateData.rating = data.rating;
                if (data.comment !== undefined)
                    updateData.comment = (_a = data.comment) === null || _a === void 0 ? void 0 : _a.trim();
                const review = yield db_1.default.review.update({
                    where: { id },
                    data: updateData,
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
                        }
                    }
                });
                return review;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to update review', 500);
            }
        });
    }
    deleteReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingReview = yield db_1.default.review.findUnique({
                    where: { id }
                });
                if (!existingReview) {
                    throw (0, errorHandler_1.createError)('Review not found', 404);
                }
                yield db_1.default.review.delete({
                    where: { id }
                });
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to delete review', 500);
            }
        });
    }
}
exports.ReviewService = ReviewService;
