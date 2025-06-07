import { Router } from 'express';
import {
  createUser,
  login,
  getUser,
  deleteUser,
  checkpassword,
  updatepassword,
  updatedetails
} from '../controllers/user.controller';
import {validateUser} from '../middlewares/user.middlewares';
const router = Router();

// POST /api/users - Create a new user
router.post('/create', createUser);
router.post('/login', login);
router.get('/get',validateUser,getUser);
router.delete('/delete',validateUser,deleteUser);
router.post('/checkpassword', validateUser, checkpassword);
router.post('/updatepassword', validateUser, updatepassword);
router.put('/update', validateUser, updatedetails);

export default router;