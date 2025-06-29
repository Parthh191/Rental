import { NextFunction, Response, Request } from 'express';
import { RentalService } from '../services/rental.service';
import { createError } from '../middlewares/errorHandler';

const rentalService = new RentalService();
export const createRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const rentalData = req.body;
    if (!rentalData || !rentalData.itemId || !rentalData.startDate || !rentalData.endDate) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental data' }
      });
      return;
    }

    const rental = await rentalService.createRental(rentalData, req.userId);
    res.status(201).json({
      success: true,
      data: rental
    });
  } catch (error) {
    next(error);
  }
}
export const getAllRentals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const rentals = await rentalService.getAllRentals(req.userId);
    res.status(200).json({
      success: true,
      data: rentals
    });
  } catch (error) {
    next(error);
  }
}
export const getRentalById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const rentalId = parseInt(req.params.id, 10);
    if (isNaN(rentalId)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental ID' }
      });
      return;
    }

    const rental = await rentalService.getRentalById(rentalId, req.userId);
    if (!rental) {
      res.status(404).json({
        success: false,
        error: { message: 'Rental not found' }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (error) {
    next(error);
  }
}

export const getrentalByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const rentals = await rentalService.getAllRentalsByUser(req.userId);
    
    if (!rentals) {
      res.status(404).json({
        success: false,
        error: { message: 'No rentals found' }
      });
      return;
    }

    res.json({
      success: true,
      data: rentals
    });
  } catch (error: any) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to fetch rentals' }
    });
  }
}

export const cancelRental =async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
    if(!req.userId){
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }
    const rentalId = parseInt(req.params.id, 10);
    if (isNaN(rentalId)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental ID' }
      });
      return;
    }
    const rental = await rentalService.cancelRental(rentalId, req.userId);
    if (!rental) {
      res.status(404).json({
        success: false,
        error: { message: 'Rental not found' }
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: rental
    });
  }
  catch (error) {
    next(error);
  }
}