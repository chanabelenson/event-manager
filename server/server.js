import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
<<<<<<< HEAD
import eventFeaturesRoutes from './routes/eventFeatures.js';
=======
import { logger } from './middleware/logger.js';
>>>>>>> main

dotenv.config();

const app = express();

<<<<<<< HEAD
app.use(cors());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
=======
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);
>>>>>>> main

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', eventFeaturesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
