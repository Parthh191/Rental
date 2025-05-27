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
exports.UserService = void 0;
const db_1 = __importDefault(require("../config/db"));
const validateEmail_1 = require("../utils/validateEmail");
const errorHandler_1 = require("../middlewares/errorHandler");
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailValidation = (0, validateEmail_1.isValidEmail)(data.email);
            if (!emailValidation.isValid) {
                throw (0, errorHandler_1.createError)(emailValidation.message, 400);
            }
            try {
                const existingUser = yield db_1.default.user.findUnique({
                    where: { email: data.email }
                });
                if (existingUser) {
                    throw (0, errorHandler_1.createError)('User with this email already exists', 409);
                }
                const user = yield db_1.default.user.create({
                    data: {
                        email: data.email,
                        name: data.name
                    }
                });
                return user;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to create user', 500);
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield db_1.default.user.findMany({
                    include: {
                        rentals: {
                            select: {
                                id: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        },
                        reviews: {
                            select: {
                                id: true,
                                itemId: true,
                                rating: true,
                                comment: true
                            }
                        }
                    }
                });
                return users;
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch users', 500);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.user.findUnique({
                    where: { id },
                    include: {
                        rentals: {
                            select: {
                                id: true,
                                itemId: true,
                                startDate: true,
                                endDate: true,
                                status: true
                            }
                        },
                        reviews: {
                            select: {
                                id: true,
                                itemId: true,
                                rating: true,
                                comment: true
                            }
                        }
                    }
                });
                if (!user) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                return user;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to fetch user', 500);
            }
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.email) {
                const emailValidation = (0, validateEmail_1.isValidEmail)(data.email);
                if (!emailValidation.isValid) {
                    throw (0, errorHandler_1.createError)(emailValidation.message, 400);
                }
            }
            try {
                const existingUser = yield db_1.default.user.findUnique({
                    where: { id }
                });
                if (!existingUser) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                if (data.email && data.email !== existingUser.email) {
                    const emailExists = yield db_1.default.user.findUnique({
                        where: { email: data.email }
                    });
                    if (emailExists) {
                        throw (0, errorHandler_1.createError)('Email already in use', 409);
                    }
                }
                const user = yield db_1.default.user.update({
                    where: { id },
                    data
                });
                return user;
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to update user', 500);
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield db_1.default.user.findUnique({
                    where: { id }
                });
                if (!existingUser) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                yield db_1.default.user.delete({
                    where: { id }
                });
            }
            catch (error) {
                if (error.statusCode)
                    throw error;
                throw (0, errorHandler_1.createError)('Failed to delete user', 500);
            }
        });
    }
}
exports.UserService = UserService;
