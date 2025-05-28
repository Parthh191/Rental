import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({
        success: false,
        error: {
            message: 'No token provided'
        }
        });
        return;
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
        res.status(401).json({
        success: false,
        error: {
            message: 'Invalid token'
        }
        });
        return;
    }

    // Add userId to request object so route handlers can access it
    req.userId = decoded;
    
    next();
}