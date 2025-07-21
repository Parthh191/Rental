import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const createOrGetChat = async (propertyId: number, userId: number, ownerId: number, token: string) => {
  const res = await axios.post(
    `${API_URL}/chats`,
    { propertyId, userId, ownerId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchMessages = async (chatId: number, token: string) => {
  const res = await axios.get(
    `${API_URL}/chats/${chatId}/messages`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const sendMessage = async (chatId: number, content: string, senderId: number, token: string) => {
  const res = await axios.post(
    `${API_URL}/chats/${chatId}/messages`,
    { content, senderId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}; 