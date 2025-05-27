import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentData = {
      ...req.body,
      paymentDate: new Date(req.body.paymentDate)
    };

    const payment = await paymentService.createPayment(paymentData);
    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid payment ID' }
      });
      return;
    }

    const payment = await paymentService.getPaymentById(id);
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByRentalId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rentalId = parseInt(req.params.rentalId);
    if (isNaN(rentalId)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid rental ID' }
      });
      return;
    }

    const payment = await paymentService.getPaymentByRentalId(rentalId);
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid payment ID' }
      });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.paymentDate) {
      updateData.paymentDate = new Date(updateData.paymentDate);
    }

    const payment = await paymentService.updatePayment(id, updateData);
    res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid payment ID' }
      });
      return;
    }

    await paymentService.deletePayment(id);
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};