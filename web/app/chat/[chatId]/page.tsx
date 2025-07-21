"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import ChatBox from "../../components/ChatBox";
import axios from "axios";

export default function MobileChatPage() {
  const { chatId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !chatId) return;
    const fetchChat = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/chats`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const found = res.data.data?.find((c: any) => c.id === Number(chatId));
        setChat(found || null);
      } catch {
        setChat(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [user, chatId]);

  // Only show on mobile
  if (typeof window !== "undefined" && window.innerWidth >= 640) {
    router.replace("/chat");
    return null;
  }

  if (!user) return <div className="text-center py-8 text-gray-400">Please log in to chat.</div>;
  if (loading) return <div className="text-center py-8 text-gray-400">Loading chat...</div>;
  if (!chat) return <div className="text-center py-8 text-gray-400">Chat not found.</div>;

  return (
    <main className="min-h-screen pt-12 bg-[#0a0a0a] flex flex-col">
      <div className="flex items-center gap-3 p-3 border-b border-purple-900/40 bg-[#18122B] sticky top-0 z-10">
        <button
          className="text-white text-xl px-2 py-1 rounded-full hover:bg-purple-900/30"
          onClick={() => router.push("/chat")}
          aria-label="Back to chat list"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
          {chat.other.name ? chat.other.name[0].toUpperCase() : "?"}
        </div>
        <div>
          <div className="font-semibold text-white text-base">{chat.other.name || "User"}</div>
          <div className="text-xs text-purple-300">{chat.property.name}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ChatBox chatId={chat.id} token={user.token} senderId={user.id} />
      </div>
    </main>
  );
} 