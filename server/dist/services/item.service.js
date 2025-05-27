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
exports.ItemService = void 0;
const db_1 = __importDefault(require("../config/db"));
const errorHandler_1 = require("../middlewares/errorHandler");
class ItemService {
    createItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!data.name || data.name.trim().length === 0) {
                    throw (0, errorHandler_1.createError)('Item name is required', 400);
                }
                if (data.pricePerDay <= 0) {
                    throw (0, errorHandler_1.createError)('Price per day must be greater than 0', 400);
                }
                const item = yield db_1.default.item.create({
                    data: {
                        name: data.name.trim(),
                        description: (_a = data.description) === null || _a === void 0 ? void 0 : _a.trim(),
                        pricePerDay: data.pricePerDay,
                        available: (_b = data.available) !== null && _b !== void 0 ? _b : true
                    }
                });
                return item;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to create item', 500);
            }
        });
    }
    getAllItems() {
        return __awaiter(this, arguments, void 0, function* (availableOnly = false) {
            try {
                const items = yield db_1.default.item.findMany({
                    where: availableOnly ? { available: true } : undefined,
                    include: {
                        rentals: {
                            select: {
                                id: true,
                                userId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        },
                        reviews: {
                            select: {
                                id: true,
                                userId: true,
                                rating: true,
                                comment: true
                            }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                });
                return items;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch items', 500);
            }
        });
    }
    getItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield db_1.default.item.findUnique({
                    where: { id },
                    include: {
                        rentals: {
                            select: {
                                id: true,
                                userId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        },
                        reviews: {
                            select: {
                                id: true,
                                userId: true,
                                rating: true,
                                comment: true
                            }
                        }
                    }
                });
                if (!item) {
                    throw (0, errorHandler_1.createError)('Item not found', 404);
                }
                return item;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch item', 500);
            }
        });
    }
    updateItem(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const existingItem = yield db_1.default.item.findUnique({
                    where: { id }
                });
                if (!existingItem) {
                    throw (0, errorHandler_1.createError)('Item not found', 404);
                }
                if (data.name && data.name.trim().length === 0) {
                    throw (0, errorHandler_1.createError)('Item name cannot be empty', 400);
                }
                if (data.pricePerDay !== undefined && data.pricePerDay <= 0) {
                    throw (0, errorHandler_1.createError)('Price per day must be greater than 0', 400);
                }
                const updateData = {};
                if (data.name)
                    updateData.name = data.name.trim();
                if (data.description !== undefined)
                    updateData.description = (_a = data.description) === null || _a === void 0 ? void 0 : _a.trim();
                if (data.pricePerDay !== undefined)
                    updateData.pricePerDay = data.pricePerDay;
                if (data.available !== undefined)
                    updateData.available = data.available;
                const item = yield db_1.default.item.update({
                    where: { id },
                    data: updateData
                });
                return item;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to update item', 500);
            }
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingItem = yield db_1.default.item.findUnique({
                    where: { id },
                    include: {
                        rentals: {
                            where: {
                                status: {
                                    in: ['PENDING', 'APPROVED']
                                }
                            }
                        }
                    }
                });
                if (!existingItem) {
                    throw (0, errorHandler_1.createError)('Item not found', 404);
                }
                if (existingItem.rentals.length > 0) {
                    throw (0, errorHandler_1.createError)('Cannot delete item with active rentals', 400);
                }
                yield db_1.default.item.delete({
                    where: { id }
                });
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to delete item', 500);
            }
        });
    }
    searchItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield db_1.default.item.findMany({
                    where: {
                        OR: [
                            {
                                name: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                description: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    },
                    include: {
                        reviews: {
                            select: {
                                id: true,
                                userId: true,
                                rating: true,
                                comment: true
                            }
                        }
                    }
                });
                return items;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to search items', 500);
            }
        });
    }
}
exports.ItemService = ItemService;
