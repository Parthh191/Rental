'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import { HiOutlineMenu } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

interface Chat {
  id: number;
  property: { id: number; name: string; imageUrl: string | null };
  other: { id: number; name: string | null };
  lastMessage: { content: string; createdAt: string } | null;
  updatedAt: string;
}

// Optional: Background gradient for consistency
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
    <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
    <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>
);

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Helper to detect small screen
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

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
        setSelectedChat(res.data.data?.[0] || null);
      } catch (err) {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user]);

  if (!user) return <div className="text-center py-8 text-gray-400">Please log in to chat.</div>;

  return (
    <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      <BackgroundGradient />
      <div className="relative max-w-full mx-auto px-0 sm:px-4 py-2 sm:py-8">
        <div className="flex flex-col sm:flex-row h-[90vh] sm:h-[80vh] bg-[#18122B] rounded-none sm:rounded-xl shadow-lg overflow-hidden border border-purple-900/40">
          {/* Sidebar */}
          <div className="w-full sm:w-80 bg-[#18122B] border-r border-purple-900/40 flex flex-col h-full sm:h-auto">
            <div className="flex items-center justify-between p-4 text-xl font-bold text-white border-b border-purple-900/40">
              <span>Chats</span>
              {/* No close button on mobile */}
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading chats...</div>
              ) : !chats.length ? (
                <div className="text-center py-8 text-gray-400">No chats yet.</div>
              ) : (
                chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 cursor-pointer hover:bg-[#28204a] transition text-sm sm:text-base ${selectedChat?.id === chat.id ? 'bg-[#28204a]' : ''}`}
                    onClick={() => {
                      if (isMobile) {
                        router.push(`/chat/${chat.id}`);
                      } else {
                        setSelectedChat(chat);
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {chat.other.name ? chat.other.name[0].toUpperCase() : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{chat.other.name || 'User'}</div>
                      <div className="text-xs text-purple-300 truncate">{chat.property.name}</div>
                      <div className="text-xs text-gray-400 truncate">{chat.lastMessage ? chat.lastMessage.content : 'No messages yet.'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Sidebar toggle for mobile (removed, only show chat list on small screens) */}
          {/* Main Chat Window: Only show on desktop */}
          <div className="hidden sm:flex flex-1 flex-col bg-[#18122B] min-h-[60vh] sm:min-h-0">
            {selectedChat ? (
              <>
                <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-purple-900/40 bg-[#18122B]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedChat.other.name ? selectedChat.other.name[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-base sm:text-lg">{selectedChat.other.name || 'User'}</div>
                    <div className="text-xs text-purple-300">{selectedChat.property.name}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 sm:p-4">
                  <ChatBox chatId={selectedChat.id} token={user.token} senderId={user.id} />
                </div>
              </>
            ) : chats.length === 0 ? (
              <div className="flex-1" />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">Select a chat to start messaging</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 