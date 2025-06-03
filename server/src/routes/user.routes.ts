import { Router } from 'express';
import {
  createUser,
  login,
  getUser
} from '../controllers/user.controller';
import {validateUser} from '../middlewares/user.middlewares';
const router = Router();

// POST /api/users - Create a new user
router.post('/create', createUser);
router.post('/login', login);
router.get('/get',validateUser,getUser);

export default router;