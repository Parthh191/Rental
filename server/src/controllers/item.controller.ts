import {NextFunction, Response, Request} from 'express';
import { ItemService } from '../services/item.service';

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
    
    // Create a clean object with only the required data
    const itemData = {
      name: req.body.name,
      description: req.body.description,
      pricePerDay: parseFloat(req.body.pricePerDay),
      available: req.body.available !== undefined ? req.body.available : true,
      userId: req.userId // Add the authenticated userId
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

export const getAllItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const availableOnly = req.query.available === 'true';
    const items = await itemService.getAllItems(availableOnly);
    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    const item = await itemService.getItemById(id);
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    const item = await itemService.updateItem(id, req.body);
    res.status(200).json({
      success: true,
      data: item,
      message: 'Item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    await itemService.deleteItem(id);
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const searchItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: { message: 'Search query is required' }
      });
      return;
    }

    const items = await itemService.searchItems(query.trim());
    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
};