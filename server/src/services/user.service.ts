import prisma from '../config/db';
import { CreateUserInput, UpdateUserInput, UserResponse } from '../models/user.model';
import { isValidEmail } from '../utils/validateEmail';
import { createError } from '../middlewares/errorHandler';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt';

// Function to hash password using SHA-256
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export class UserService {
  async createUser(data: CreateUserInput): Promise<UserResponse> {
    const emailValidation = isValidEmail(data.email);
    if (!emailValidation.isValid) {
      throw createError(emailValidation.message!, 400);
    }

    if (!data.password) {
      throw createError('Password is required', 400);
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }

      // Hash the password before storing
      const hashedPassword = hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name
        },
        // Exclude password from the response
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true
        }
      });
      console.log('Generating token for user:', data.email);
      const token = generateToken({ email: user.email, id: user.id })
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token // Include the JWT token
      } as UserResponse;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create user', 500);
    }
  }

  static async login(email: string, password: string): Promise<UserResponse | null> {
    const emailValidation = isValidEmail(email);
    if (!emailValidation.isValid) {
      console.log('Invalid email format:', email);
      throw createError(emailValidation.message!, 400);
    }

    if (!password) {
      console.log('Password required but not provided');
      throw createError('Password is required', 400);
    }

    try {
      console.log('Finding user by email:', email);
      const hashedPassword = hashPassword(password);

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.log('User not found with email:', email);
        return null; // User not found
      }
      
      if (user.password !== hashedPassword) {
        console.log('Password mismatch for user:', email);
        return null; // Invalid password
      }

      // Generate JWT token
      console.log('Generating token for user:', email);
      const token = generateToken({ email: user.email, id: user.id });
      if (!token) {
        console.error('Failed to generate token for user:', email);
        throw createError('Failed to generate token', 500);
      }

      console.log('Login successful for user:', email);
      // Exclude password from the response and include token
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token // Include the JWT token
      } as UserResponse;
    } catch (error) {
      console.error('Login service error:', error);
      throw createError('Login failed', 500);
    }
  }
  async getUser(userId: number): Promise<UserResponse | null> {
    try {
      // Get user basic info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          rentals: { // Include user's rental history based on actual schema
            select: {
              id: true,
              startDate: true,
              endDate: true, 
              status: true,
              item: {
                select: {
                  id: true,
                  name: true, // "name" is used instead of "title" in the schema
                  imageUrl: true // "imageUrl" is used instead of "image" in the schema
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 5 // Limit to recent 5 rentals
          },
          items: { // Items listed by the user
            select: {
              id: true,
              name: true, // "name" is used instead of "title" in the schema
              pricePerDay: true, // "pricePerDay" is used instead of "price" in the schema
              imageUrl: true, // "imageUrl" is used instead of "image" in the schema
              available: true,
              category: {
                select: {
                  name: true
                }
              },
              location: true
            },
            take: 4 // Limit to 4 items for display
          },
          reviews: { // Reviews received by the user
            select: {
              id: true,
              rating: true,
              comment: true,
              item: {
                select: {
                  name: true // "name" is used instead of "title" in the schema
                }
              }
            },
            orderBy: {
              id: 'desc' // No createdAt in review table, using id as proxy
            },
            take: 5 // Limit to recent 5 reviews
          }
        }
      });

      if (!user) {
        throw createError('User not found', 404);
      }
      
      // Calculate user's average rating
      let averageRating = 0;
      if (user.reviews && user.reviews.length > 0) {
        const totalRating = user.reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / user.reviews.length;
      }
      
      // Calculate total items listed and total items rented
      const stats = {
        itemsListed: user.items?.length || 0,
        totalRentals: user.rentals?.length || 0,
        totalReviews: user.reviews?.length || 0,
        averageRating: averageRating.toFixed(1)
      };
      
      return {
        ...user,
        stats
      } as UserResponse;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to retrieve user', 500);
    }
  }
}