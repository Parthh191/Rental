import prisma from '../config/db';
import { CreatePaymentInput, UpdatePaymentInput, PaymentResponse } from '../models/payment.model';
import { createError } from '../middlewares/errorHandler';

export class PaymentService {
  async createPayment(data: CreatePaymentInput): Promise<PaymentResponse> {
    try {
      // Validate rental exists
      const rental = await prisma.rental.findUnique({
        where: { id: data.rentalId }
      });

      if (!rental) {
        throw createError('Rental not found', 404);
      }

      // Check if payment already exists for this rental
      const existingPayment = await prisma.payment.findUnique({
        where: { rentalId: data.rentalId }
      });

      if (existingPayment) {
        throw createError('Payment already exists for this rental', 409);
      }

      // Validate amount
      if (data.amount <= 0) {
        throw createError('Payment amount must be greater than 0', 400);
      }

      // Validate method
      if (!data.method || data.method.trim().length === 0) {
        throw createError('Payment method is required', 400);
      }

      const payment = await prisma.payment.create({
        data: {
          rentalId: data.rentalId,
          amount: data.amount,
          paymentDate: data.paymentDate,
          method: data.method.trim()
        },
        include: {
          rental: {
            select: {
              id: true,
              userId: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          }
        }
      });

      return payment;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create payment', 500);
    }
  }

  async getAllPayments(): Promise<PaymentResponse[]> {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          rental: {
            select: {
              id: true,
              userId: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          }
        },
        orderBy: {
          paymentDate: 'desc'
        }
      });

      return payments;
    } catch (error) {
      throw createError('Failed to fetch payments', 500);
    }
  }

  async getPaymentById(id: number): Promise<PaymentResponse> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          rental: {
            select: {
              id: true,
              userId: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          }
        }
      });

      if (!payment) {
        throw createError('Payment not found', 404);
      }

      return payment;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch payment', 500);
    }
  }

  async getPaymentByRentalId(rentalId: number): Promise<PaymentResponse | null> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { rentalId },
        include: {
          rental: {
            select: {
              id: true,
              userId: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          }
        }
      });

      return payment;
    } catch (error) {
      throw createError('Failed to fetch payment', 500);
    }
  }

  async updatePayment(id: number, data: UpdatePaymentInput): Promise<PaymentResponse> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!existingPayment) {
        throw createError('Payment not found', 404);
      }

      if (data.amount !== undefined && data.amount <= 0) {
        throw createError('Payment amount must be greater than 0', 400);
      }

      if (data.method && data.method.trim().length === 0) {
        throw createError('Payment method cannot be empty', 400);
      }

      const updateData: any = {};
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.paymentDate) updateData.paymentDate = data.paymentDate;
      if (data.method) updateData.method = data.method.trim();

      const payment = await prisma.payment.update({
        where: { id },
        data: updateData,
        include: {
          rental: {
            select: {
              id: true,
              userId: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          }
        }
      });

      return payment;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to update payment', 500);
    }
  }

  async deletePayment(id: number): Promise<void> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!existingPayment) {
        throw createError('Payment not found', 404);
      }

      await prisma.payment.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to delete payment', 500);
    }
  }
}