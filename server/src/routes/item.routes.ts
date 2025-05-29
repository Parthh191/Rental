import { Router } from 'express';
import {
  createItem,
} from '../controllers/item.controller';
import { validateUser } from '../middlewares/user.middlewares';

const router = Router();

// POST /api/items - Create a new item (protected route)
router.post('/create', validateUser, createItem);

export default router;