"use client";

import { useState, useEffect } from "react";
import { Send, User, Mail, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

export function CoachMessages({ token }: { token: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [sending, setSending] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (receiverId: string) => {
    const content = replyInput[receiverId];
    if (!content?.trim()) return;

    setSending(prev => ({ ...prev, [receiverId]: true }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId, content })
      });
      if (res.ok) {
        setReplyInput(prev => ({ ...prev, [receiverId]: "" }));
        fetchMessages();
      }
    } catch (e) {
    } finally {
      setSending(prev => ({ ...prev, [receiverId]: false }));
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>;

  const conversations: { [key: string]: any[] } = {};
  const myId = user?._id || user?.id;

  messages.forEach(m => {
    const sId = (m.senderId?._id || m.senderId || "").toString();
    const rId = (m.receiverId?._id || m.receiverId || "").toString();
    const otherId = sId === myId ? rId : sId;
    
    if (otherId && otherId !== "undefined") {
      if (!conversations[otherId]) conversations[otherId] = [];
      conversations[otherId].push(m);
    }
  });

  return (
    <div className="space-y-6">
      {Object.keys(conversations).length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-border">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400">No messages from students yet.</p>
        </div>
      ) : (
        Object.entries(conversations).map(([userId, msgs]) => {
          const firstMsg = msgs.find(m => (m.senderId?._id || m.senderId).toString() === userId);
          const userName = firstMsg?.senderId?.name || `Student (${userId.slice(-6)})`;

          return (
            <motion.div 
              key={userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white capitalize">{userName}</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{msgs.length} messages</span>
              </div>

              <div className="p-6 h-64 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-900/50">
                {msgs.map((m, i) => {
                  const sId = (m.senderId?._id || m.senderId).toString();
                  const isMe = sId === myId;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-xs ${isMe ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-100 shadow-sm'}`}>
                      {m.content}
                    </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/10 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Reply to student..."
                  value={replyInput[userId] || ""}
                  onChange={(e) => setReplyInput(prev => ({ ...prev, [userId]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply(userId)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all"
                />
                <button 
                  onClick={() => handleReply(userId)}
                  disabled={sending[userId] || !replyInput[userId]?.trim()}
                  className="px-4 py-2 bg-slate-900 dark:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {sending[userId] ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reply"}
                </button>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
