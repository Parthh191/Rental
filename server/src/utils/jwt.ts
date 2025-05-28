import jwt, { SignOptions, Secret } from 'jsonwebtoken';

// Define the secret with explicit typing
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'rentalSystem_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (email: string): string => {
  // Using type assertion for expiresIn
  const options = { 
    expiresIn: JWT_EXPIRES_IN 
  } as SignOptions;
  
  return jwt.sign({ email }, JWT_SECRET, options);
};

export const verifyToken = (token: string): { email: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded;
  } catch (error) {
    return null;
  }
};