import prisma from '../config/db';
import { CreateItemInput, UpdateItemInput, ItemResponse,createCategoryInput,CreateCategoryResponse } from '../models/item.model';
import { createError } from '../middlewares/errorHandler';

export class ItemService {
  async createCategory(data:createCategoryInput): Promise<CreateCategoryResponse> {
    try {
      if (!data.name) {
        throw createError('Category name is required', 400);
      }

      // First try to find an existing category with case-insensitive search
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: data.name.trim(),
            mode: 'insensitive'
          }
        }
      });

      // If category exists, return it
      if (existingCategory) {
        console.log('Using existing category:', JSON.stringify(existingCategory, null, 2));
        return existingCategory;
      }

      // If category doesn't exist, create a new one
      const category = await prisma.category.create({
        data: { name: data.name.trim() }
      });
      console.log('New category created successfully:', JSON.stringify(category, null, 2));
      return category;
    } catch (error: any) {   
      console.error('Error handling category:', error);
      
      if (error.code === 'P2002') {
        // This shouldn't happen now since we check for existence first
        throw createError('Category with this name already exists', 409);
      } else if (error.code === 'P2025') {
        throw createError('Failed to create category', 404);
      }
      
      if (error.statusCode) throw error;
      throw createError('Failed to handle category', 500);
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

  async getItemsByCategoryName(categoryName: string): Promise<ItemResponse[]> {
    try {
      if (!categoryName || categoryName.trim().length === 0) {
        throw createError('Category name is required', 400);
      }

      // First find the category with case-insensitive search
      const category = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName.trim(),
            mode: 'insensitive'  // This makes the search case-insensitive
          }
        }
      });

      if (!category) {
        throw createError('Category not found', 404);
      }

      // Then find all items in that category
      const items = await prisma.item.findMany({
        where: { categoryId: category.id },
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

      if (items.length === 0) {
        throw createError('No items found in this category', 404);
      }

      return items;
    } catch (error: any) {
      console.error('Error fetching items by category name:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch items by category name', 500);
    }
  }

  async updateItem(id: number, data: UpdateItemInput): Promise<ItemResponse> {
    try {
      if (!id || isNaN(id)) {
        throw createError('Valid item ID is required', 400);
      }

      // First, fetch the item to check ownership
      const existingItem = await prisma.item.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true
            }
          }
        }
      });

      if (!existingItem) {
        throw createError('Item not found', 404);
      }

      // Verify ownership
      if (existingItem.owner.id !== data.userId) {
        throw createError('Unauthorized: Only the owner can update this item', 403);
      }

      // Ensure at least one field to update is provided
      if (!data.name && !data.description && !data.pricePerDay === undefined && 
          data.available === undefined && !data.imageUrl && !data.location) {
        throw createError('At least one field to update is required', 400);
      }

      // Prepare the update data
      const updateData: any = {};
      if (data.name) updateData.name = data.name.trim();
      if (data.description !== undefined) updateData.description = data.description?.trim();
      if (data.pricePerDay !== undefined) {
        if (isNaN(data.pricePerDay) || data.pricePerDay <= 0) {
          throw createError('Price per day must be a valid number greater than 0', 400);
        }
        updateData.pricePerDay = data.pricePerDay;
      }
      if (data.available !== undefined) updateData.available = data.available;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.location !== undefined) updateData.location = data.location;

      // Update the item
      const item = await prisma.item.update({
        where: { id },
        data: updateData,
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

      console.log('Item updated successfully:', JSON.stringify(item, null, 2));
      return item;
    } catch (error: any) {
      console.error('Error updating item:', error);
      
      if (error.code === 'P2025') {
        throw createError('Item not found', 404);
      } else if (error.code === 'P2002') {
        throw createError('An item with these details already exists', 409);
      }
      
      if (error.statusCode) throw error;
      throw createError('Failed to update item', 500);
    }
  }
  async getAllItems(): Promise<ItemResponse[]> {
    try {
      const items = await prisma.item.findMany({
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

      return items;
    } catch (error: any) {
      console.error('Error fetching all items:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch all items', 500);
    }
  }
  async deleteItem(id: number, userId: number): Promise<ItemResponse> {
    try {
      if (!id || isNaN(id)) {
        throw createError('Valid item ID is required', 400);
      }

      // First, fetch the item to check ownership
      const existingItem = await prisma.item.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true
            }
          }
        }
      });

      if (!existingItem) {
        throw createError('Item not found', 404);
      }

      // Verify ownership
      if (existingItem.owner.id !== userId) {
        throw createError('Unauthorized: Only the owner can delete this item', 403);
      }

      // Delete the item
      const deletedItem = await prisma.item.delete({
        where: { id },
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

      console.log('Item deleted successfully:', JSON.stringify(deletedItem, null, 2));
      return deletedItem;
    } catch (error: any) {
      console.error('Error deleting item:', error);
      
      if (error.code === 'P2025') {
        throw createError('Item not found', 404);
      }
      
      if (error.statusCode) throw error;
      throw createError('Failed to delete item', 500);
    }
  }

  async getItemById(id: number): Promise<ItemResponse | null> {
    try {
      if (!id || isNaN(id)) {
        throw createError('Valid item ID is required', 400);
      }

      const item = await prisma.item.findUnique({
        where: { id },
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

      if (!item) {
        throw createError('Item not found', 404);
      }

      return item;
    } catch (error: any) {
      console.error('Error fetching item by ID:', error);
      
      if (error.statusCode) throw error;
      throw createError('Failed to fetch item by ID', 500);
    }
  }
  async getItemByOwnerId(ownerId: number): Promise<ItemResponse[]> {
    try {
      const items = await prisma.item.findMany({
        where: { ownerId },
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

      return items;
    } catch (error: any) {
      console.error('Error fetching items by owner ID:', error);
      throw createError('Failed to fetch items by owner ID', 500);
    }
  }
}