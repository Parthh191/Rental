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
    const { email, password } = req.body;
    const user = await UserService.login(email, password);
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
      return;
    }
    
    // The token is now included in the user object from the service
    res.status(200).json({
      success: true,
      data: user,
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
}