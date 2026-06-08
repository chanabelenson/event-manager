import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import invitationRoutes from './routes/invitation.js';
import producerRoutes from './routes/producers.js';
import { logger } from './middleware/logger.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in .env');
  process.exit(1);
}

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/events', authMiddleware, eventRoutes);
app.use('/api/invitation', invitationRoutes);
app.use('/api/producers', authMiddleware, producerRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
