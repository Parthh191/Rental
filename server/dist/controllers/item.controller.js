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
exports.searchItems = exports.deleteItem = exports.updateItem = exports.getItemById = exports.getAllItems = exports.createItem = void 0;
const item_service_1 = require("../services/item.service");
const itemService = new item_service_1.ItemService();
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield itemService.createItem(req.body);
        res.status(201).json({
            success: true,
            data: item,
            message: 'Item created successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createItem = createItem;
const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const availableOnly = req.query.available === 'true';
        const items = yield itemService.getAllItems(availableOnly);
        res.status(200).json({
            success: true,
            data: items,
            count: items.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllItems = getAllItems;
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid item ID' }
            });
            return;
        }
        const item = yield itemService.getItemById(id);
        res.status(200).json({
            success: true,
            data: item
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getItemById = getItemById;
const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid item ID' }
            });
            return;
        }
        const item = yield itemService.updateItem(id, req.body);
        res.status(200).json({
            success: true,
            data: item,
            message: 'Item updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid item ID' }
            });
            return;
        }
        yield itemService.deleteItem(id);
        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteItem = deleteItem;
const searchItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        if (!query || query.trim().length === 0) {
            res.status(400).json({
                success: false,
                error: { message: 'Search query is required' }
            });
            return;
        }
        const items = yield itemService.searchItems(query.trim());
        res.status(200).json({
            success: true,
            data: items,
            count: items.length
        });
    }
    catch (error) {
        next(error);
    }
});
exports.searchItems = searchItems;
