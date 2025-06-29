import { Router } from 'express';
import { createRental,
    getAllRentals,
    getRentalById,
    getrentalByUser,
    cancelRental
 } from '../controllers/rental.controller';
import { validateUser } from '../middlewares/user.middlewares';
const router = Router();

router.post('/',validateUser,createRental);
router.get('/',validateUser,getAllRentals);
router.get('/getrentalbyuser',validateUser,getrentalByUser);
router.get('/:id',validateUser,getRentalById);
router.delete('/:id',validateUser,cancelRental);

export default router;