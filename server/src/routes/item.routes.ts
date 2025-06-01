import { Router } from 'express';
import {
  createItem,
  getItemsByCategoryName,
  updateItem,
} from '../controllers/item.controller';
import { validateUser } from '../middlewares/user.middlewares';

const router = Router();

// POST /api/items - Create a new item (protected route)
router.post('/create', validateUser, createItem);
// New route for getting items by category name (case-insensitive)
router.get('/category/:categoryName', validateUser, getItemsByCategoryName);

router.put('/update/:id', validateUser, updateItem);

export default router;