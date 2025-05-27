import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';

const reviewService = new ReviewService();

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid review ID' }
      });
      return;
    }

    const review = await reviewService.getReviewById(id);
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByItemId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itemId = parseInt(req.params.itemId);
    if (isNaN(itemId)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid item ID' }
      });
      return;
    }

    const reviews = await reviewService.getReviewsByItemId(itemId);
    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid user ID' }
      });
      return;
    }

    const reviews = await reviewService.getReviewsByUserId(userId);
    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid review ID' }
      });
      return;
    }

    const review = await reviewService.updateReview(id, req.body);
    res.status(200).json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid review ID' }
      });
      return;
    }

    await reviewService.deleteReview(id);
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};