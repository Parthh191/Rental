import express from "express";
import User from './routes/user.routes';
import Rental from './routes/rental.routes';
import Item from './routes/item.routes';
import Payment from './routes/payment.routes';
import Review from './routes/review.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());

// API routes
app.use('/api/users', User);
app.use('/api/rentals', Rental);
app.use('/api/items', Item);
app.use('/api/payments', Payment);
app.use('/api/reviews', Review);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes - using a proper middleware instead of '*'
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;