import prisma from '../config/db';
import { CreateRentalInput, UpdateRentalInput, RentalResponse } from '../models/rental.model';
import { RentalStatus } from '../../generated/prisma';
import { createError } from '../middlewares/errorHandler';

export class RentalService {
  async createRental(data: CreateRentalInput): Promise<RentalResponse> {
    try {
      // Validate dates
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw createError('Start date must be before end date', 400);
      }

      if (new Date(data.startDate) < new Date()) {
        throw createError('Start date cannot be in the past', 400);
      }

      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: { id: data.userId }
      });

      if (!userExists) {
        throw createError('User not found', 404);
      }

      // Check if item exists and is available
      const item = await prisma.item.findUnique({
        where: { id: data.itemId }
      });

      if (!item) {
        throw createError('Item not found', 404);
      }

      if (!item.available) {
        throw createError('Item is not available for rental', 400);
      }

      // Check for conflicting rentals
      const conflictingRental = await prisma.rental.findFirst({
        where: {
          itemId: data.itemId,
          status: {
            in: [RentalStatus.PENDING, RentalStatus.APPROVED]
          },
          OR: [
            {
              startDate: {
                lte: data.endDate
              },
              endDate: {
                gte: data.startDate
              }
            }
          ]
        }
      });

      if (conflictingRental) {
        throw createError('Item is already rented during this period', 409);
      }

      const rental = await prisma.rental.create({
        data: {
          userId: data.userId,
          itemId: data.itemId,
          startDate: data.startDate,
          endDate: data.endDate
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              pricePerDay: true
            }
          },
          payment: true
        }
      });

      return rental;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create rental', 500);
    }
  }

  async getAllRentals(): Promise<RentalResponse[]> {
    try {
      const rentals = await prisma.rental.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              pricePerDay: true
            }
          },
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return rentals;
    } catch (error) {
      throw createError('Failed to fetch rentals', 500);
    }
  }

  async getRentalById(id: number): Promise<RentalResponse> {
    try {
      const rental = await prisma.rental.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              pricePerDay: true
            }
          },
          payment: true
        }
      });

      if (!rental) {
        throw createError('Rental not found', 404);
      }

      return rental;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch rental', 500);
    }
  }

  async getRentalsByUserId(userId: number): Promise<RentalResponse[]> {
    try {
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!userExists) {
        throw createError('User not found', 404);
      }

      const rentals = await prisma.rental.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              pricePerDay: true
            }
          },
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return rentals;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch user rentals', 500);
    }
  }

  async updateRental(id: number, data: UpdateRentalInput): Promise<RentalResponse> {
    try {
      const existingRental = await prisma.rental.findUnique({
        where: { id }
      });

      if (!existingRental) {
        throw createError('Rental not found', 404);
      }

      // Validate dates if provided
      if (data.startDate || data.endDate) {
        const startDate = data.startDate || existingRental.startDate;
        const endDate = data.endDate || existingRental.endDate;

        if (new Date(startDate) >= new Date(endDate)) {
          throw createError('Start date must be before end date', 400);
        }
      }

      const rental = await prisma.rental.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              pricePerDay: true
            }
          },
          payment: true
        }
      });

      return rental;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to update rental', 500);
    }
  }

  async deleteRental(id: number): Promise<void> {
    try {
      const existingRental = await prisma.rental.findUnique({
        where: { id }
      });

      if (!existingRental) {
        throw createError('Rental not found', 404);
      }

      await prisma.rental.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to delete rental', 500);
    }
  }
}