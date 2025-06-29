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

            // Check if item exists and is available
            const item = await prisma.item.findUnique({ where: { id: rentalData.itemId } });
            if (!item) {
                throw createError('Item not found', 404);
            }
            if (!item.available) {
                throw createError('Item is not available for rent', 400);
            }

            // Check for overlapping rentals for this item
            const overlap = await prisma.rental.findFirst({
                where: {
                    itemId: rentalData.itemId,
                    OR: [
                        {
                            startDate: { lte: new Date(rentalData.endDate) },
                            endDate: { gte: new Date(rentalData.startDate) }
                        }
                    ],
                    status: { in: ['PENDING', 'APPROVED'] }
                }
            });
            if (overlap) {
                throw createError('Item is already rented for the selected dates', 400);
            }

            // Set default values if not provided
            const rental: CreateRental = {
                itemId: rentalData.itemId,
                startDate: new Date(rentalData.startDate),
                endDate: new Date(rentalData.endDate),
                status: rentalData.status || 'PENDING',
                // totalPrice and description are not in the Rental model, so do not include them in DB create
            };

            // Create the rental in the database
            const createdRental = await prisma.rental.create({
                data: {
                    itemId: rental.itemId,
                    startDate: rental.startDate,
                    endDate: rental.endDate,
                    status: rental.status,
                    userId: userId // Associate the rental with the user
                }
            });
            return createdRental;
        } catch (error: any) {
            // Log the real error for debugging
            console.error('Rental creation error:', error);
            throw createError(error.message || 'Failed to create rental', 500);
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
            // Fetch rental by ID and ensure it belongs to the user with item and user details
            const rental = await prisma.rental.findFirst({
                where: {
                    id: rentalId,
                    userId: userId
                },
                include: {
                    item: {
                        include: {
                            category: true,
                            owner: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });

            if (!rental) {
                throw createError('Rental not found', 404);
            }

            // Transform the data to match frontend expectations
            return {
                id: rental.id,
                startDate: rental.startDate,
                endDate: rental.endDate,
                status: rental.status,
                createdAt: rental.createdAt,
                updatedAt: rental.updatedAt,
                item: {
                    id: rental.item.id,
                    name: rental.item.name,
                    description: rental.item.description,
                    pricePerDay: rental.item.pricePerDay,
                    imageUrl: rental.item.imageUrl,
                    location: rental.item.location,
                    category: rental.item.category?.name || 'Uncategorized',
                    owner: rental.item.owner
                },
                user: rental.user
            };
        } catch (error) {
            throw createError('Failed to fetch rental', 500);
        }
    }
    async getAllRentalsByUser(userId: number): Promise<any[]> {
        try {
            // Fetch all rentals for a specific user with item details
            const rentals = await prisma.rental.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    item: {
                        include: {
                            category: true
                        }
                    }
                }
            });
            
            if (!rentals || rentals.length === 0) {
                return [];
            }

            // Transform the data to match the frontend expectations
            return rentals.map(rental => {
                if (!rental.item) {
                    throw createError('Rental item not found', 404);
                }
                
                return {
                    id: rental.id,
                    title: rental.item.name, // Using name instead of title as per schema
                    description: rental.item.description,
                    price: rental.item.pricePerDay, // Using pricePerDay instead of price
                    category: rental.item.category?.name || 'Uncategorized',
                    imageUrl: rental.item.imageUrl,
                    startDate: rental.startDate,
                    endDate: rental.endDate,
                    status: rental.status
                };
            });
        } catch (error) {
            throw createError('Failed to fetch user rentals', 500);
        }
    }
    async cancelRental(rentalId: number, userId: number): Promise<any> {
        try {
            // Check if the rental exists and belongs to the user
            const rental = await prisma.rental.findFirst({
                where: {
                    id: rentalId,
                    userId: userId
                }
            });

            if (!rental) {
                throw createError('Rental not found or does not belong to the user', 404);
            }

            // Check if rental can be cancelled (only pending or approved rentals)
            if (rental.status === 'COMPLETED') {
                throw createError('Completed rentals cannot be cancelled', 400);
            }

            // Delete the rental from the database
            const deletedRental = await prisma.rental.delete({
                where: { id: rentalId }
            });

            return deletedRental;
        } catch (error) {
            throw createError('Failed to cancel rental', 500);
        }
    }
}