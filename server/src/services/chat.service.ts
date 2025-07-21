import prisma from '../config/db';

export const createOrGetChat = async (propertyId: number, userId: number, ownerId: number) => {
  let chat = await prisma.chat.findFirst({
    where: { propertyId, userId, ownerId },
  });
  if (!chat) {
    chat = await prisma.chat.create({
      data: { propertyId, userId, ownerId },
    });
  }
  return chat;
};

export const getUserChats = async (userId: number) => {
  // Fetch chats where user is either user or owner
  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        { userId },
        { ownerId: userId }
      ]
    },
    include: {
      property: {
        select: { id: true, name: true, imageUrl: true }
      },
      user: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
  return chats.map(chat => {
    // Determine the other person
    const isOwner = chat.ownerId === userId;
    const other = isOwner ? chat.user : chat.owner;
    return {
      id: chat.id,
      property: chat.property,
      other,
      lastMessage: chat.messages[0] || null,
      updatedAt: chat.updatedAt
    };
  });
};

export const sendMessage = async (chatId: number, content: string, senderId: number) => {
  return prisma.message.create({
    data: { chatId, content, senderId },
  });
};

export const getMessages = async (chatId: number) => {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
  });
}; 