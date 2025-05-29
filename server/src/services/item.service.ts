import prisma from '../config/db';
import { CreateItemInput, UpdateItemInput, ItemResponse,createCategoryInput,CreateCategoryResponse } from '../models/item.model';
import { createError } from '../middlewares/errorHandler';

export class ItemService {
  async createCategory(data:createCategoryInput): Promise<CreateCategoryResponse> {
    try {
      if (!data.name) {
        throw createError('Category name is required', 400);
      }
      const category = await prisma.category.create({
        data: { name: data.name.trim() }
      });
      console.log('Category created successfully:', JSON.stringify(category, null, 2));
      return category;
    } catch (error: any) {   
      console.error('Error creating category:', error);
      
      if (error.code === 'P2002') {
        throw createError('Category with this name already exists', 409);
      } else if (error.code === 'P2025') {
        throw createError('Failed to create category', 404);
      }
      
      if (error.statusCode) throw error;
      throw createError('Failed to create category', 500);
    }}
    
  async createItem(data: CreateItemInput): Promise<ItemResponse> {
    try {
     
      
      if (!data.name || data.name.trim().length === 0) {
        throw createError('Item name is required', 400);
      }

      if (!data.pricePerDay || isNaN(data.pricePerDay) || data.pricePerDay <= 0) {
        throw createError('Price per day must be a valid number greater than 0', 400);
      }

      // Ensure userId is available
      if (!data.userId) {
        console.log('Missing userId in request data');
        throw createError('User ID is required', 400);
      }
      if(!data.categoryId){
        console.log('Missing categoryId in request data');
        throw createError('Category ID is required', 400);
      }
      // Create item with proper relation handling
      const createData = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        pricePerDay: data.pricePerDay,
        available: data.available !== undefined ? data.available : true,
        imageUrl: data.imageUrl || null,
        location: data.location || null,
        owner: {
          // Use connect instead of direct ID assignment to properly handle the relation
          connect: {
            id: data.userId
          }
        },
        category: {
          // Connect to the existing category
          connect: {
            id: data.categoryId
          }
        }
      };
      
      
      const item = await prisma.item.create({
        data: createData,
        // Include owner and category details in the response
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      console.log('Item created successfully:', JSON.stringify(item, null, 2));
      return item;
    } catch (error: any) {
      console.error('Error creating item:', error);
      
      if (error.code === 'P2002') {
        throw createError('An item with these details already exists', 409);
      } else if (error.code === 'P2003') {
        throw createError('Referenced user or category does not exist', 400);
      } else if (error.code === 'P2025') {
        throw createError('User or category not found', 404);
      }
      
      if (error.statusCode) throw error;
      throw createError('Failed to create item', 500);
    }
  }

}