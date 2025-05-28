import { NextFunction,Request,Response } from "express";
import {verifyToken} from "../utils/jwt";
export const validateUser=(req: Request, res: Response, next: NextFunction): void => {
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
    next();
}