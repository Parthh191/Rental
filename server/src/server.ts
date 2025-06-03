import dotenv from 'dotenv';
import app from './app';
import prisma from './config/db';

// Load environment variables
dotenv.config();

// Change port to 3001 to avoid conflict with Next.js frontend
const PORT = process.env.PORT || 3001;

// Test database connection before starting the server
async function startServer() {
  try {
    // Test query to check database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection established successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1); // Exit with error code
  }
}

startServer();