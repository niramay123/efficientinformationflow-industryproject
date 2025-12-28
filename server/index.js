import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './databases/db.js';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import http from 'http';

import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import notificationRoutes from './routes/notification.routes.js'
import documentRoutes from './routes/document.routes.js'
import { initializeSocket } from './sockets/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.ACTIVATION_SECRET) {
  console.error("FATAL ERROR: ACTIVATION_SECRET is not defined in .env file loaded from: " + path.resolve(__dirname, '.env'));
}
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use('/public', express.static("uploads"));

// Routes
app.use('/api', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', documentRoutes)

// MongoDB connection
connectDB();

// Create HTTP server & integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*'
  }
});

// Initialize Socket.IO
initializeSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
