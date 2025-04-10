import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './utils/errorHandler';
import healthRoutes from './routes/healthRoute';

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Apply routes
app.use('/health', healthRoutes);

// Error handling
app.use(errorMiddleware);

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

export default app;
