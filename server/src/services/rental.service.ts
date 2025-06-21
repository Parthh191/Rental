import prisma from '../config/db';
import { createError } from '../middlewares/errorHandler';
import { CreateRental } from '../models/rental.model';
export class RentalService{
    async createRental(rentalData: any, userId: number): Promise<any> {
        try {
            // Validate required fields
            if (!rentalData.itemId || !rentalData.startDate || !rentalData.endDate) {
                throw createError('Invalid rental data: itemId, startDate, and endDate are required', 400);
            }

            // Set default values if not provided
            const rental: CreateRental = {
                itemId: rentalData.itemId,
                startDate: new Date(rentalData.startDate),
                endDate: new Date(rentalData.endDate),
                status: rentalData.status || 'PENDING',
                totalPrice: rentalData.totalPrice || 0,
                description: rentalData.description || ''
            };

            // Create the rental in the database
            const createdRental = await prisma.rental.create({
                data: {
                    ...rental,
                    userId: userId // Associate the rental with the user
                }
            });
            return createdRental;
        } catch (error) {
            throw createError('Failed to create rental', 500);
        }
    }
    async getAllRentals(userId: number): Promise<any[]> {
        try {
            // Fetch all rentals associated with the user
            const rentals = await prisma.rental.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' }
            });
            return rentals;
        } catch (error) {
            throw createError('Failed to fetch rentals', 500);
        }
    }
    async getRentalById(rentalId: number, userId: number): Promise<any> {
        try {
            // Fetch rental by ID and ensure it belongs to the user
            const rental = await prisma.rental.findFirst({
                where: {
                    id: rentalId,
                    userId: userId
                }
            });

            if (!rental) {
                throw createError('Rental not found', 404);
            }

            return rental;
        } catch (error) {
            throw createError('Failed to fetch rental', 500);
        }
    }
}