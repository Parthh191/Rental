"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// POST /api/users - Create a new user
router.post('/', user_controller_1.createUser);
// GET /api/users - Get all users
router.get('/', user_controller_1.getAllUsers);
// GET /api/users/:id - Get user by ID
router.get('/:id', user_controller_1.getUserById);
// PUT /api/users/:id - Update user by ID
router.put('/:id', user_controller_1.updateUser);
// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
