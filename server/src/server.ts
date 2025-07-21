import dotenv from 'dotenv';
import app from './app';
import prisma from './config/db';
import {Server} from 'socket.io';
import http from 'http';
import { socketAuth } from './middlewares/auth.middleware';

// Load environment variables
dotenv.config();

// Change port to 3001 to avoid conflict with Next.js frontend
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://<your-production-url>'],
  },
});

io.use(socketAuth);

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinRoom', ({ chatId }) => {
    socket.join(String(chatId));
  });

  socket.on('sendMessage', async ({ chatId, content }) => {
    const user = (socket as any).user; // Type cast to access user property set by socketAuth
    if (!user) return;
    // Save to DB
    const message = await prisma.message.create({
      data: {
        chatId: Number(chatId),
        content,
        senderId: user.id,
      },
    });
    // Emit to room
    io.to(String(chatId)).emit('receiveMessage', { message });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
