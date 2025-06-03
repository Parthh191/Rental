import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing credentials in request body');
      res.status(400).json({
        success: false,
        error: {
          message: 'Email and password are required'
        }
      });
      return;
    }
    
    const user = await UserService.login(email, password);
    
    if (!user) {
      console.log('Invalid login attempt:', { email });
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
      return;
    }
    
    console.log('Login successful:', { email, userId: user.id });
    
    // The token is now included in the user object from the service
    res.status(200).json({
      success: true,
      data: user,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
}
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const userId = req.userId; // userId is set by validateUser middleware
    if (!userId) {
      console.log('User ID not found in request');
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized access'
        }
      });
      return;
    }

    const user = await userService.getUser(userId);
    
    if (!user) {
      console.log('User not found:', { userId });
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  }
  catch (error) {
    console.error('Get user error:', error);
    next(error);
  }
}