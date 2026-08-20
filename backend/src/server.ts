import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import searchRoutes from './routes/searchRoutes';
import viewRoutes from './routes/viewRoutes';
import interestRoutes from './routes/interestRoutes';
import shortlistRoutes from './routes/shortlistRoutes';
import notificationRoutes from './routes/notificationRoutes';
import messageRoutes from './routes/messageRoutes';
import adminRoutes from './routes/adminRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads (Biodata PDFs and Photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/profile-views', viewRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/shortlists', shortlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), app: 'Pavithra Bandhan Matrimony API' });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

app.listen(PORT, () => {
  console.log(`[Server Running]: http://localhost:${PORT}`);
});
