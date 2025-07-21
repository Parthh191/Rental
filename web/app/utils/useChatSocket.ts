import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export function useChatSocket(token: string, chatId: number, onMessage: (msg: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !chatId) return;

    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      socket.emit('joinRoom', { chatId });
    });

    socket.on('receiveMessage', ({ message }) => {
      onMessage(message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token, chatId, onMessage]);

  const sendMessage = (content: string) => {
    socketRef.current?.emit('sendMessage', { chatId, content });
  };

  return { sendMessage };
} 