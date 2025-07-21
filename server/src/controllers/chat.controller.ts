import { Request, Response } from 'express';
import prisma from '../config/db';
import { getUserChats } from '../services/chat.service';

export const createOrGetChat = async (req: Request, res: Response) => {
  const { propertyId, userId, ownerId } = req.body;
  try {
    let chat = await prisma.chat.findFirst({
      where: { propertyId, userId, ownerId },
    });
    if (!chat) {
      chat = await prisma.chat.create({
        data: { propertyId, userId, ownerId },
      });
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create or get chat' });
  }
};

export const getUserChatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const chats = await getUserChats(userId);
    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { content, senderId } = req.body;
  try {
    const message = await prisma.message.create({
      data: { chatId: Number(chatId), content, senderId },
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: Number(chatId) },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}; 