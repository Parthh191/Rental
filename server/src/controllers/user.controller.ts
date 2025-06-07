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
export const deleteUser= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
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

    const deleted = await userService.deleteUser(userId);
    
    if (!deleted) {
      console.log('User not found or could not be deleted:', { userId });
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found or could not be deleted'
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
}
export const checkpassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const { password } = req.body;
    if (!password) {
      console.log('Password not provided in request body');
      res.status(400).json({
        success: false,
        error: {
          message: 'Password is required'
        }
      });
      return;
    }

    const isValid = await userService.checkPassword(userId, password);
    
    if (!isValid) {
      console.log('Invalid password for user:', { userId });
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid password'
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Password is valid'
    });
  }
  catch (error) {
    console.error('Check password error:', error);
    next(error);
  }
}

export const updatepassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const  newPassword  = req.body.newPassword;
    if (!newPassword) {
      console.log('New password not provided in request body');
      res.status(400).json({
        success: false,
        error: {
          message: 'New password are required'
        }
      });
      return;
    }

    const updated = await userService.updatePassword(userId, newPassword);
    
    if (!updated) {
      console.log('Failed to update password for user:', { userId });
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update password'
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  }
  catch (error) {
    console.error('Update password error:', error);
    next(error);
  }
}

export const updatedetails=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      console.log('No data provided for update');
      res.status(400).json({
        success: false,
        error: {
          message: 'No data provided for update'
        }
      });
      return;
    }

    const updatedUser = await userService.updateDetails(userId, updatedData);
    
    if (!updatedUser) {
      console.log('Failed to update user details:', { userId });
      res.status(400).json({
        success: false,
        error: {
          message: 'Failed to update user details'
        }
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User details updated successfully'
    });
  }
  catch (error) {
    console.error('Update details error:', error);
    next(error);
  }
}