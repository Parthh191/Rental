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