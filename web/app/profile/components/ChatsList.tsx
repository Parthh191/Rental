'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface Chat {
  id: number;
  property: { id: number; name: string; imageUrl: string | null };
  other: { id: number; name: string | null };
  lastMessage: { content: string; createdAt: string } | null;
  updatedAt: string;
}

export default function ChatsList() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/chats`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setChats(res.data.data || []);
      } catch (err) {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user]);

  if (loading) return <div className="text-center py-8 text-gray-400">Loading chats...</div>;
  if (!chats.length) return <div className="text-center py-8 text-gray-400">No chats yet.</div>;

  return (
    <div className="space-y-4">
      {chats.map(chat => (
        <div
          key={chat.id}
          className="flex items-center bg-[#18122B] hover:bg-[#28204a] rounded-lg p-4 cursor-pointer shadow transition"
          onClick={() => router.push(`/chat`)}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mr-4">
            {chat.other.name ? chat.other.name[0].toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-lg truncate">{chat.other.name || 'User'}</span>
              <span className="text-xs text-gray-400 ml-2">{chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleString() : ''}</span>
            </div>
            <div className="text-sm text-purple-300 truncate">{chat.property.name}</div>
            <div className="text-sm text-gray-300 truncate">
              {chat.lastMessage ? chat.lastMessage.content : 'No messages yet.'}
            </div>
          </div>
          {/* Unread badge placeholder */}
          {/* <span className="ml-4 bg-pink-500 text-white text-xs rounded-full px-2 py-1">1</span> */}
        </div>
      ))}
    </div>
  );
} 