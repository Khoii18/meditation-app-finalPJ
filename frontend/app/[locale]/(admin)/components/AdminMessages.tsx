"use client";

import { useState, useEffect } from "react";
import { Send, User, Mail, CheckCircle2, Loader2, MessageSquare, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function AdminMessages({ token }: { token: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [sending, setSending] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages/admin`, {
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

  // Group messages by user
  const conversations: { [key: string]: any[] } = {};
  messages.forEach(m => {
    const isMe = m.senderId === JSON.parse(localStorage.getItem("user") || "{}")._id;
    const otherId = isMe ? m.receiverId : m.senderId;
    if (!conversations[otherId]) conversations[otherId] = [];
    conversations[otherId].push(m);
  });

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 border border-teal-100 p-6 rounded-[2rem] mb-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-teal-900">Admin Support Center</h2>
          <p className="text-teal-600 text-sm">Hệ thống phản hồi tự động đã được kích hoạt. Hãy trả lời các thắc mắc của người dùng bên dưới.</p>
        </div>
      </div>

      {Object.keys(conversations).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Chưa có yêu cầu hỗ trợ nào.</p>
        </div>
      ) : (
        Object.entries(conversations).map(([userId, msgs]) => (
          <motion.div 
            key={userId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Người dùng (ID: {userId.slice(-6)})</h3>
                  <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Support Request</p>
                </div>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-[10px] text-slate-400 font-bold border border-slate-100">{msgs.length} messages</span>
            </div>

            <div className="p-6 h-80 overflow-y-auto space-y-4 bg-slate-50/20 custom-scrollbar">
              {msgs.slice().reverse().map((m, i) => {
                const isMe = m.senderId !== userId;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-teal-600 text-white rounded-tr-none shadow-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
                      {m.content}
                      {m.autoReplied && <span className="block mt-2 text-[8px] font-black uppercase tracking-tighter opacity-70">🤖 Auto-Replied</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
              <input 
                type="text" 
                placeholder="Nhập phản hồi cho người dùng..."
                value={replyInput[userId] || ""}
                onChange={(e) => setReplyInput(prev => ({ ...prev, [userId]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleReply(userId)}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-teal-500 transition-all"
              />
              <button 
                onClick={() => handleReply(userId)}
                disabled={sending[userId] || !replyInput[userId]?.trim()}
                className="px-6 py-3 bg-teal-600 text-white rounded-2xl text-xs font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                {sending[userId] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Gửi
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
