import prisma from '../config/db';
import { CreateReviewInput, UpdateReviewInput, ReviewResponse } from '../models/review.model';
import { createError } from '../middlewares/errorHandler';

export class ReviewService {
  async createReview(data: CreateReviewInput): Promise<ReviewResponse> {
    try {
      // Validate user exists
      const userExists = await prisma.user.findUnique({
        where: { id: data.userId }
      });

      if (!userExists) {
        throw createError('User not found', 404);
      }

      // Validate item exists
      const itemExists = await prisma.item.findUnique({
        where: { id: data.itemId }
      });

      if (!itemExists) {
        throw createError('Item not found', 404);
      }

      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw createError('Rating must be between 1 and 5', 400);
      }

      // Check if user has rented this item
      const userRental = await prisma.rental.findFirst({
        where: {
          userId: data.userId,
          itemId: data.itemId,
          status: 'COMPLETED'
        }
      });

      if (!userRental) {
        throw createError('You can only review items you have rented and completed', 400);
      }

      // Check if user already reviewed this item
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: data.userId,
          itemId: data.itemId
        }
      });

      if (existingReview) {
        throw createError('You have already reviewed this item', 409);
      }

      const review = await prisma.review.create({
        data: {
          userId: data.userId,
          itemId: data.itemId,
          rating: data.rating,
          comment: data.comment?.trim()
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
          }
        }
      });

      return review;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create review', 500);
    }
  }

  async getAllReviews(): Promise<ReviewResponse[]> {
    try {
      const reviews = await prisma.review.findMany({
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
          }
        },
        orderBy: {
          id: 'desc'
        }
      });

      return reviews;
    } catch (error) {
      throw createError('Failed to fetch reviews', 500);
    }
  }

  async getReviewById(id: number): Promise<ReviewResponse> {
    try {
      const review = await prisma.review.findUnique({
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
          }
        }
      });

      if (!review) {
        throw createError('Review not found', 404);
      }

      return review;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch review', 500);
    }
  }

  async getReviewsByItemId(itemId: number): Promise<ReviewResponse[]> {
    try {
      const itemExists = await prisma.item.findUnique({
        where: { id: itemId }
      });

      if (!itemExists) {
        throw createError('Item not found', 404);
      }

      const reviews = await prisma.review.findMany({
        where: { itemId },
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
          }
        },
        orderBy: {
          id: 'desc'
        }
      });

      return reviews;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch item reviews', 500);
    }
  }

  async getReviewsByUserId(userId: number): Promise<ReviewResponse[]> {
    try {
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!userExists) {
        throw createError('User not found', 404);
      }

      const reviews = await prisma.review.findMany({
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
          }
        },
        orderBy: {
          id: 'desc'
        }
      });

      return reviews;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch user reviews', 500);
    }
  }

  async updateReview(id: number, data: UpdateReviewInput): Promise<ReviewResponse> {
    try {
      const existingReview = await prisma.review.findUnique({
        where: { id }
      });

      if (!existingReview) {
        throw createError('Review not found', 404);
      }

      if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw createError('Rating must be between 1 and 5', 400);
      }

      const updateData: any = {};
      if (data.rating) updateData.rating = data.rating;
      if (data.comment !== undefined) updateData.comment = data.comment?.trim();

      const review = await prisma.review.update({
        where: { id },
        data: updateData,
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
          }
        }
      });

      return review;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to update review', 500);
    }
  }

  async deleteReview(id: number): Promise<void> {
    try {
      const existingReview = await prisma.review.findUnique({
        where: { id }
      });

      if (!existingReview) {
        throw createError('Review not found', 404);
      }

      await prisma.review.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to delete review', 500);
    }
  }
}