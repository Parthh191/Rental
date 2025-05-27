import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems
} from '../controllers/item.controller';

const router = Router();

// POST /api/items - Create a new item
router.post('/', createItem);

// GET /api/items - Get all items (with optional available filter)
router.get('/', getAllItems);

// GET /api/items/search - Search items
router.get('/search', searchItems);

// GET /api/items/:id - Get item by ID
router.get('/:id', getItemById);

// PUT /api/items/:id - Update item by ID
router.put('/:id', updateItem);

// DELETE /api/items/:id - Delete item by ID
router.delete('/:id', deleteItem);

export default router;