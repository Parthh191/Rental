import { Router } from 'express';
import {
  createUser,
  login
} from '../controllers/user.controller';

const router = Router();

// POST /api/users - Create a new user
router.post('/create', createUser);
router.post('/login', login);

export default router;