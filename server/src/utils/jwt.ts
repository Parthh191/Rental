import jwt, { SignOptions, Secret } from 'jsonwebtoken';

// Define the secret with explicit typing
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'rentalSystem_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Interface for token payload
interface TokenPayload {
  id?: number;
  email: string;
  name?: string | null;
  iat?: number;
  exp?: number;
}

export const generateToken = (userData: { email: string; id?: number; name?: string | null }): string => {
  // Using type assertion for expiresIn
  const options = { 
    expiresIn: JWT_EXPIRES_IN 
  } as SignOptions;
  
  return jwt.sign(userData, JWT_SECRET, options);
};

// Helper function to extract userId from token
export const verifyToken = (token: string): number | null => {
  try {
    console.log('Verifying token:', token.substring(0, 10) + '...');
    
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('Decoded token payload:', decoded);
    
    // Ensure id is returned as a number
    if (decoded.id !== undefined) {
      return Number(decoded.id);
    }
    
    console.warn('No user ID found in token payload');
    return null;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};