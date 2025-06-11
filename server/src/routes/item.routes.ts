import { Router } from 'express';
import {
  createItem,
  getItemsByCategoryName,
  updateItem,
  getAllItems,
  deleteItem,
  getItemById
} from '../controllers/item.controller';
import { validateUser } from '../middlewares/user.middlewares';

const router = Router();

// POST /api/items - Create a new item (protected route)
router.post('/create', validateUser, createItem);
// New route for getting items by category name (case-insensitive)
router.get('/category/:categoryName', validateUser, getItemsByCategoryName);

// PUT /api/items/update/:id - Update an item by ID (protected route)
router.put('/update/:id', validateUser, updateItem);
// GET /api/items - Get all items (public route)
router.get('/',validateUser,getAllItems);

// Delete route for removing an item by ID (protected route)
router.delete('/delete/:id', validateUser, deleteItem); 
//Get Item by ID (protected route)
router.get('/:id', validateUser, getItemById);

export default router;