"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function AdminChat() {
  const { isLoggedIn, user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchMessages();
    }
  }, [isOpen, isLoggedIn]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data.filter((m: any) => m.isAdminChat));
      }
    } catch (e) {}
  };

  const handleSend = async () => {
    if (!message.trim() || !isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receiverId: "65f8a0000000000000000001", // Default Admin ID (or fetch from settings)
          content: message,
          isAdminChat: true
        })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
        setMessage("");
        // Refresh after 2s to get auto-reply
        setTimeout(fetchMessages, 2500);
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-white dark:bg-[#121214] rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-slate-900 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Lunaria Support</h3>
                  <p className="text-teal-500 text-[10px] uppercase tracking-widest font-black">Online Now</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-transparent">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                    <MessageCircle className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400">Gặp vấn đề về tài khoản hoặc thanh toán? Hãy nhắn cho chúng tôi nhé!</p>
                </div>
              )}
              {messages.map((m, i) => {
                const isMe = m.senderId === user?._id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white dark:bg-white/5 border border-border text-slate-700 dark:text-white rounded-tl-none'}`}>
                      {m.content}
                      <p className={`text-[9px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-[#121214] border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-50 dark:bg-white/5 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-colors relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 border-4 border-white dark:border-background rounded-full" />
        )}
      </motion.button>
    </div>
  );
}
