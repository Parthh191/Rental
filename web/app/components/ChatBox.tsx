'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchMessages } from '../utils/chatApi';
import { useChatSocket } from '../utils/useChatSocket';

interface ChatBoxProps {
  chatId: number;
  token: string;
  senderId: number;
}

export default function ChatBox({ chatId, token, senderId }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Fetch initial messages
  useEffect(() => {
    if (!chatId || !token) return;
    fetchMessages(chatId, token).then(msgs => {
      setMessages(msgs);
      setHasLoadedOnce(true);
      setShouldScroll(true); // Always scroll to bottom on initial load
    });
  }, [chatId, token]);

  // Track if user is at the bottom
  useEffect(() => {
    const el = scrollableRef.current;
    if (!el) return;
    const handleScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      setIsAtBottom(atBottom);
    };
    el.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle incoming messages
  const handleReceiveMessage = useCallback(
    (msg: any) => setMessages((prev) => [...prev, msg]),
    []
  );

  const { sendMessage } = useChatSocket(token, chatId, handleReceiveMessage);

  // Auto-scroll logic
  useEffect(() => {
    if (!scrollableRef.current) return;
    // On initial load or after sending, always scroll
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScroll(false);
      return;
    }
    // On new incoming message, only scroll if user is at bottom
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScroll, isAtBottom]);

  // Set shouldScroll true after sending a message
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
      setShouldScroll(true); // Always scroll after sending
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[60vh] sm:max-h-[70vh]">
      {/* Messages area */}
      <div ref={scrollableRef} className="grow overflow-y-auto px-1 py-2 sm:px-2 sm:py-4 space-y-2 bg-[#18122B]">
        {messages.map((msg, idx) => {
          const isSelf = msg.senderId === senderId;
          return (
            <div key={idx} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85vw] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2 shadow text-xs sm:text-sm break-words ${isSelf ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-[#28204a] text-purple-200'}`}>
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <span className="font-semibold text-[10px] sm:text-xs">{isSelf ? 'You' : 'Them'}</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <div className="flex items-center gap-2 p-2 sm:p-3 border-t border-purple-900/40 bg-[#18122B]">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-3 py-2 sm:px-4 sm:py-2 bg-[#28204a] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-base"
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition text-xs sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
} 