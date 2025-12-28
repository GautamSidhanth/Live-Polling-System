import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this assignment, can be restricted later
    methods: ["GET", "POST"]
  }
});

import { prisma } from './prismaClient';

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import routes from './routes';
app.use('/api', routes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Store io instance in app for use in controllers if needed, 
// though we will primarily use the socket handler
app.set('io', io);

import { setupSocketHandlers } from './sockets/PollSocketHandler';
setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
