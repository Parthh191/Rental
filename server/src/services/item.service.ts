import prisma from '../config/db';
import { CreateItemInput, UpdateItemInput, ItemResponse } from '../models/item.model';
import { createError } from '../middlewares/errorHandler';

export class ItemService {
  async createItem(data: CreateItemInput): Promise<ItemResponse> {
    try {
      if (!data.name || data.name.trim().length === 0) {
        throw createError('Item name is required', 400);
      }

      if (data.pricePerDay <= 0) {
        throw createError('Price per day must be greater than 0', 400);
      }

      const item = await prisma.item.create({
        data: {
          name: data.name.trim(),
          description: data.description?.trim(),
          pricePerDay: data.pricePerDay,
          available: data.available ?? true
        }
      });

      return item;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create item', 500);
    }
  }

  async getAllItems(availableOnly: boolean = false): Promise<ItemResponse[]> {
    try {
      const items = await prisma.item.findMany({
        where: availableOnly ? { available: true } : undefined,
        include: {
          rentals: {
            select: {
              id: true,
              userId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          },
          reviews: {
            select: {
              id: true,
              userId: true,
              rating: true,
              comment: true
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      });

      return items;
    } catch (error) {
      throw createError('Failed to fetch items', 500);
    }
  }

  async getItemById(id: number): Promise<ItemResponse> {
    try {
      const item = await prisma.item.findUnique({
        where: { id },
        include: {
          rentals: {
            select: {
              id: true,
              userId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          },
          reviews: {
            select: {
              id: true,
              userId: true,
              rating: true,
              comment: true
            }
          }
        }
      });

      if (!item) {
        throw createError('Item not found', 404);
      }

      return item;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch item', 500);
    }
  }

  async updateItem(id: number, data: UpdateItemInput): Promise<ItemResponse> {
    try {
      const existingItem = await prisma.item.findUnique({
        where: { id }
      });

      if (!existingItem) {
        throw createError('Item not found', 404);
      }

      if (data.name && data.name.trim().length === 0) {
        throw createError('Item name cannot be empty', 400);
      }

      if (data.pricePerDay !== undefined && data.pricePerDay <= 0) {
        throw createError('Price per day must be greater than 0', 400);
      }

      const updateData: any = {};
      if (data.name) updateData.name = data.name.trim();
      if (data.description !== undefined) updateData.description = data.description?.trim();
      if (data.pricePerDay !== undefined) updateData.pricePerDay = data.pricePerDay;
      if (data.available !== undefined) updateData.available = data.available;

      const item = await prisma.item.update({
        where: { id },
        data: updateData
      });

      return item;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to update item', 500);
    }
  }

  async deleteItem(id: number): Promise<void> {
    try {
      const existingItem = await prisma.item.findUnique({
        where: { id },
        include: {
          rentals: {
            where: {
              status: {
                in: ['PENDING', 'APPROVED']
              }
            }
          }
        }
      });

      if (!existingItem) {
        throw createError('Item not found', 404);
      }

      if (existingItem.rentals.length > 0) {
        throw createError('Cannot delete item with active rentals', 400);
      }

      await prisma.item.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to delete item', 500);
    }
  }

  async searchItems(query: string): Promise<ItemResponse[]> {
    try {
      const items = await prisma.item.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          reviews: {
            select: {
              id: true,
              userId: true,
              rating: true,
              comment: true
            }
          }
        }
      });

      return items;
    } catch (error) {
      throw createError('Failed to search items', 500);
    }
  }
}