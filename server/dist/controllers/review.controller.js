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
exports.deleteReview = exports.updateReview = exports.getReviewsByUserId = exports.getReviewsByItemId = exports.getReviewById = exports.getAllReviews = exports.createReview = void 0;
const review_service_1 = require("../services/review.service");
const reviewService = new review_service_1.ReviewService();
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewService.createReview(req.body);
        res.status(201).json({
            success: true,
            data: review,
            message: 'Review created successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createReview = createReview;
const getAllReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewService.getAllReviews();
        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllReviews = getAllReviews;
const getReviewById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid review ID' }
            });
            return;
        }
        const review = yield reviewService.getReviewById(id);
        res.status(200).json({
            success: true,
            data: review
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReviewById = getReviewById;
const getReviewsByItemId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = parseInt(req.params.itemId);
        if (isNaN(itemId)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid item ID' }
            });
            return;
        }
        const reviews = yield reviewService.getReviewsByItemId(itemId);
        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReviewsByItemId = getReviewsByItemId;
const getReviewsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid user ID' }
            });
            return;
        }
        const reviews = yield reviewService.getReviewsByUserId(userId);
        res.status(200).json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReviewsByUserId = getReviewsByUserId;
const updateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid review ID' }
            });
            return;
        }
        const review = yield reviewService.updateReview(id, req.body);
        res.status(200).json({
            success: true,
            data: review,
            message: 'Review updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid review ID' }
            });
            return;
        }
        yield reviewService.deleteReview(id);
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
