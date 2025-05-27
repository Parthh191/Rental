import prisma from '../config/db';
import { CreateUserInput, UpdateUserInput, UserResponse } from '../models/user.model';
import { isValidEmail } from '../utils/validateEmail';
import { createError } from '../middlewares/errorHandler';

export class UserService {
  async createUser(data: CreateUserInput): Promise<UserResponse> {
    const emailValidation = isValidEmail(data.email);
    if (!emailValidation.isValid) {
      throw createError(emailValidation.message!, 400);
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }

      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name
        }
      });

      return user;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create user', 500);
    }
  }

  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const users = await prisma.user.findMany({
        include: {
          rentals: {
            select: {
              id: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          },
          reviews: {
            select: {
              id: true,
              itemId: true,
              rating: true,
              comment: true
            }
          }
        }
      });

      return users;
    } catch (error) {
      throw createError('Failed to fetch users', 500);
    }
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          rentals: {
            select: {
              id: true,
              itemId: true,
              startDate: true,
              endDate: true,
              status: true
            }
          },
          reviews: {
            select: {
              id: true,
              itemId: true,
              rating: true,
              comment: true
            }
          }
        }
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      return user;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to fetch user', 500);
    }
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<UserResponse> {
    if (data.email) {
      const emailValidation = isValidEmail(data.email);
      if (!emailValidation.isValid) {
        throw createError(emailValidation.message!, 400);
      }
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw createError('User not found', 404);
      }

      if (data.email && data.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: data.email }
        });

        if (emailExists) {
          throw createError('Email already in use', 409);
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data
      });

      return user;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to update user', 500);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw createError('User not found', 404);
      }

      await prisma.user.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to delete user', 500);
    }
  }
}