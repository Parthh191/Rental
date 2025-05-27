import { Request, Response, NextFunction } from 'express';
import { RentalService } from '../services/rental.service';

const rentalService = new RentalService();

export const createRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rentalData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };

    const rental = await rentalService.createRental(rentalData);
    res.status(201).json({
      success: true,
      data: rental,
      message: 'Rental created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRentals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rentals = await rentalService.getAllRentals();
    res.status(200).json({
      success: true,
      data: rentals,
      count: rentals.length
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental ID' }
      });
      return;
    }

    const rental = await rentalService.getRentalById(id);
    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid user ID' }
      });
      return;
    }

    const rentals = await rentalService.getRentalsByUserId(userId);
    res.status(200).json({
      success: true,
      data: rentals,
      count: rentals.length
    });
  } catch (error) {
    next(error);
  }
};

export const updateRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental ID' }
      });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const rental = await rentalService.updateRental(id, updateData);
    res.status(200).json({
      success: true,
      data: rental,
      message: 'Rental updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRental = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental ID' }
      });
      return;
    }

    await rentalService.deleteRental(id);
    res.status(200).json({
      success: true,
      message: 'Rental deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};