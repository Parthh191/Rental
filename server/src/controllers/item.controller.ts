import {NextFunction, Response, Request} from 'express';
import { ItemService} from '../services/item.service';

const itemService = new ItemService();

export const createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if userId is present in the request
    // This assumes that userId is set by a previous middleware (e.g., validateUser)
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: {
          message: 'User authentication required'
        }
      });
      return;
    }
    const cat=req.body.category;
    if (!cat ) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Category is required'
        }
      });
      return;
    }

    const category = await itemService.createCategory({name:cat});
    if (!category ) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to create category or category ID is missing'
        }
      });
      return;
    }
    console.log('Category created successfully:', category);
    // Create a clean object with only the required data
    const itemData = {
      name: req.body.name,
      description: req.body.description,
      pricePerDay: parseFloat(req.body.pricePerDay),
      available: req.body.available !== undefined ? req.body.available : true,
      userId: req.userId, // Add the authenticated userId
      categoryId: category.id, // Now properly typed with id property
      imageUrl: req.body?.imageUrl, // Optional field
      location: req.body.location // Assuming location is provided in the request
    };
    
    console.log('Processed item data:', itemData);
    
    const item = await itemService.createItem(itemData);
    res.status(201).json({
      success: true,
      data: item,
      message: 'Item created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getItemsByCategoryName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryName = req.params.categoryName;
    if (!categoryName) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Category name is required'
        }
      });
      return;
    }

    const items = await itemService.getItemsByCategoryName(categoryName);
    res.status(200).json({
      success: true,
      data: items,
      message: 'Items retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    // Add userId to the update data for ownership verification
    const updateData = {
      ...req.body,
      userId: req.userId
    };

    const item = await itemService.updateItem(id, updateData);
    res.status(200).json({
      success: true,
      data: item,
      message: 'Item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json({
      success: true,
      data: items,
      message: 'Items retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    await itemService.deleteItem(id, req.userId);
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    const item = await itemService.getItemById(id);
    if (!item) {
      res.status(404).json({
        success: false,
        error: { message: 'Item not found' }
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: item,
      message: 'Item retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};