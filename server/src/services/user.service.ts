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

      return user as UserResponse;
    } catch (error: any) {
      if (error.statusCode) throw error;
      throw createError('Failed to create user', 500);
    }
  }

  static async login(email: string, password: string): Promise<UserResponse | null> {
    const emailValidation = isValidEmail(email);
    if (!emailValidation.isValid) {
      throw createError(emailValidation.message!, 400);
    }

    if (!password) {
      throw createError('Password is required', 400);
    }

    try {
      const hashedPassword = hashPassword(password);

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || user.password !== hashedPassword) {
        return null; // Invalid credentials
      }

      // Generate JWT token
      const token = generateToken(user.email);
      if (!token) {
        throw createError('Failed to generate token', 500);
      }

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
      throw createError('Login failed', 500);
    }
  }
}