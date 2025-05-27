"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = require("../controllers/item.controller");
const router = (0, express_1.Router)();
// POST /api/items - Create a new item
router.post('/', item_controller_1.createItem);
// GET /api/items - Get all items (with optional available filter)
router.get('/', item_controller_1.getAllItems);
// GET /api/items/search - Search items
router.get('/search', item_controller_1.searchItems);
// GET /api/items/:id - Get item by ID
router.get('/:id', item_controller_1.getItemById);
// PUT /api/items/:id - Update item by ID
router.put('/:id', item_controller_1.updateItem);
// DELETE /api/items/:id - Delete item by ID
router.delete('/:id', item_controller_1.deleteItem);
exports.default = router;
