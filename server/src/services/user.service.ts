import prisma from '../config/db';
import { CreateUserInput, UpdateUserInput, UserResponse } from '../models/user.model';
import { isValidEmail } from '../utils/validateEmail';
import { createError } from '../middlewares/errorHandler';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt';

// Use a consistent salt for password hashing
const SALT = process.env.PASSWORD_SALT || 'defaultSalt123';

// Function to hash password using SHA-256 with salt
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
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
        }
      });

      console.log('Generating token for user:', data.email);
      // Generate token after user creation
      const token = generateToken({ 
        email: user.email, 
        id: user.id,
        name: user.name 
      });

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
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          phoneCountry: true,
          phoneNumber: true,
          addressStreet: true,
          addressHouseNumber: true,
          addressLandmark: true,
          addressCity: true,
          addressState: true,
          addressCountry: true,
          addressPostalCode: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
          rentals: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              status: true,
              item: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 5
          },
          items: {
            select: {
              id: true,
              name: true,
              pricePerDay: true,
              imageUrl: true,
              available: true,
              category: {
                select: {
                  name: true
                }
              },
              location: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              item: {
                select: {
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              items: true,
              rentals: true,
              reviews: true
            }
          }
        }
      });

      if (!user) return null;

      // Calculate average rating
      const reviews = await prisma.review.findMany({
        where: {
          userId: userId
        },
        select: {
          rating: true
        }
      });

      const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

      // Filter out any null categories and map the items
      const formattedItems = user.items.map(item => ({
        ...item,
        category: item.category || { name: 'Uncategorized' }
      }));

      return {
        ...user,
        items: formattedItems,
        stats: {
          itemsListed: user._count.items,
          totalRentals: user._count.rentals,
          totalReviews: user._count.reviews,
          averageRating
        }
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<Boolean|void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Delete user and related data
      await prisma.user.delete({
        where: { id: userId }
      });

      console.log(`User with ID ${userId} deleted successfully.`);
      return true; // Indicate successful deletion
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to delete user', 500);
    }
  }
  async checkPassword(userId: number, password: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      const hashedPassword = hashPassword(password);
      return user.password === hashedPassword;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to check password', 500);
    }
  }
  async updatePassword(userId: number, newPassword: string): Promise< Boolean> {
    try{
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      if (!newPassword) {
        throw createError('New password is required', 400);
      }

      // Hash the new password before updating
      const hashedPassword = hashPassword(newPassword);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword
        }
      });

      console.log(`Password updated successfully for user ID ${userId}.`);
      return true;
    }
    catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to update password', 500);
    }
  }
  async updateDetails(userId: number, data: UpdateUserInput): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Validate email if provided
      if (data.email && !isValidEmail(data.email).isValid) {
        throw createError('Invalid email format', 400);
      }

      // Update user details
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email: data.email || user.email,
          name: data.name || user.name,
          phoneCountry: data.phoneCountry|| user.phoneCountry,
          phoneNumber: data.phoneNumber|| user.phoneNumber,
          addressStreet: data.addressStreet|| user.addressStreet,
          addressHouseNumber: data.addressHouseNumber|| user.addressHouseNumber,
          addressLandmark: data.addressLandmark|| user.addressLandmark,
          addressCity: data.addressCity|| user.addressCity,
          addressState: data.addressState|| user.addressState,
          addressCountry: data.addressCountry|| user.addressCountry,
          addressPostalCode: data.addressPostalCode|| user.addressPostalCode,
          bio: data.bio || user.bio,
        }
      });

      // Get full user data with relationships
      return await this.getUser(updatedUser.id) as UserResponse;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw createError('Email already exists', 400);
      }
      if (error.statusCode) throw error;
      throw createError('Failed to update user details', 500);
    }
  }
  async updateUser(userId: number, data: UpdateUserInput): Promise<UserResponse> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          phoneCountry: data.phoneCountry,
          phoneNumber: data.phoneNumber,
          addressStreet: data.addressStreet,
          addressHouseNumber: data.addressHouseNumber,
          addressLandmark: data.addressLandmark,
          addressCity: data.addressCity,
          addressState: data.addressState,
          addressCountry: data.addressCountry,
          addressPostalCode: data.addressPostalCode,
          bio: data.bio,
          ...(data.email && { email: data.email }),
          ...(data.password && { password: hashPassword(data.password) })
        }
      });

      // Get full user data with relationships
      return await this.getUser(updatedUser.id) as UserResponse;
    } catch (error: any) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        throw createError('Email already exists', 400);
      }
      throw createError('Failed to update user', 500);
    }
  }
}