import { Router } from 'express';
import {
  createItem,
  getItemsByCategoryName,
  updateItem,
  getAllItems,
  deleteItem,
  getItemById,
  getItemByOwner
} from '../controllers/item.controller';
import { validateUser } from '../middlewares/user.middlewares';

const router = Router();

// POST /api/items/create - Create a new item (protected route)
router.post('/create', validateUser, createItem);

// GET /api/items/category/:categoryName - Get items by category
router.get('/category/:categoryName', validateUser, getItemsByCategoryName);

// GET /api/items/getitembyowner - Get items by owner
router.get('/getitembyowner', validateUser, getItemByOwner);

// GET /api/items/:id - Get item by ID (protected route)
router.get('/:id', validateUser, getItemById);

// PUT /api/items/update/:id - Update an item by ID (protected route)
router.put('/update/:id', validateUser, updateItem);

// DELETE /api/items/delete/:id - Delete an item by ID (protected route)
router.delete('/delete/:id', validateUser, deleteItem);

// GET /api/items - Get all items (protected route)
router.get('/', validateUser, getAllItems);

export default router;