import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems
} from '../controllers/item.controller';
import { validateUser } from '../middlewares/user.middlewares';

const router = Router();

// POST /api/items - Create a new item (protected route)
router.post('/create', validateUser, createItem);

// GET /api/items - Get all items (with optional available filter)
router.get('/get', getAllItems);

// GET /api/items/search - Search items
router.get('/search', searchItems);

// GET /api/items/:id - Get item by ID
router.get('/:id', getItemById);

// PUT /api/items/:id - Update item by ID (protected route)
router.put('/:id', validateUser, updateItem);

// DELETE /api/items/:id - Delete item by ID (protected route)
router.delete('/:id', validateUser, deleteItem);

export default router;