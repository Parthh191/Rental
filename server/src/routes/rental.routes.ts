import { Router } from 'express';
import { createRental,
    getAllRentals,
    getRentalById
 } from '../controllers/rental.controller';
import { validateUser } from '../middlewares/user.middlewares';
const router = Router();

router.post('/',validateUser,createRental);
router.get('/',validateUser,getAllRentals);
router.get('/:id',validateUser,getRentalById);

export default router;