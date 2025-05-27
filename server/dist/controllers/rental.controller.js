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
exports.deleteRental = exports.updateRental = exports.getRentalsByUserId = exports.getRentalById = exports.getAllRentals = exports.createRental = void 0;
const rental_service_1 = require("../services/rental.service");
const rentalService = new rental_service_1.RentalService();
const createRental = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rentalData = Object.assign(Object.assign({}, req.body), { startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate) });
        const rental = yield rentalService.createRental(rentalData);
        res.status(201).json({
            success: true,
            data: rental,
            message: 'Rental created successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createRental = createRental;
const getAllRentals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rentals = yield rentalService.getAllRentals();
        res.status(200).json({
            success: true,
            data: rentals,
            count: rentals.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRentals = getAllRentals;
const getRentalById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid rental ID' }
            });
            return;
        }
        const rental = yield rentalService.getRentalById(id);
        res.status(200).json({
            success: true,
            data: rental
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRentalById = getRentalById;
const getRentalsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid user ID' }
            });
            return;
        }
        const rentals = yield rentalService.getRentalsByUserId(userId);
        res.status(200).json({
            success: true,
            data: rentals,
            count: rentals.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRentalsByUserId = getRentalsByUserId;
const updateRental = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid rental ID' }
            });
            return;
        }
        const updateData = Object.assign({}, req.body);
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }
        const rental = yield rentalService.updateRental(id, updateData);
        res.status(200).json({
            success: true,
            data: rental,
            message: 'Rental updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateRental = updateRental;
const deleteRental = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid rental ID' }
            });
            return;
        }
        yield rentalService.deleteRental(id);
        res.status(200).json({
            success: true,
            message: 'Rental deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRental = deleteRental;
