"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, MessageSquare, Shield, CheckCircle2, User, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function AdminMessages({ token }: { token: string }) {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [sending, setSending] = useState<{ [key: string]: boolean }>({});

  const adminId = (currentUser?._id || currentUser?.id || "").toString().toLowerCase();
  const MOCK_ADMIN_ID = "65f8a0000000000000000001".toLowerCase();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (receiverId: string) => {
    const content = replyInput[receiverId];
    if (!content?.trim()) return;

    setSending(prev => ({ ...prev, [receiverId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/messages/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId, content })
      });
      if (res.ok) {
        setReplyInput(prev => ({ ...prev, [receiverId]: "" }));
        fetchMessages();
      } else {
        const err = await res.json();
        alert("Server Error: " + JSON.stringify(err));
      }
    } catch (e) {
      alert("Connection Error: " + (e as Error).message);
    } finally {
      setSending(prev => ({ ...prev, [receiverId]: false }));
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleUpdateMessage = async (msgId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messageId: msgId, content: editContent })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m._id === msgId ? { ...m, content: editContent, isEdited: true } : m));
        setEditingId(null);
        setEditContent("");
      }
    } catch (e) {
      alert("Error updating message");
    }
  };

  if (loading || authLoading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>;

  const conversations: { [key: string]: { name: string; messages: any[] } } = {};
  
  messages.forEach(m => {
    if (m.autoReplied) return; // Hide auto-replies in admin view

    const sId = (m.senderId?._id || m.senderId || "").toString().toLowerCase();
    const rId = (m.receiverId?._id || m.receiverId || "").toString().toLowerCase();
    let otherId = "";
    if (sId !== adminId && sId !== MOCK_ADMIN_ID) otherId = sId;
    else if (rId !== adminId && rId !== MOCK_ADMIN_ID) otherId = rId;

    if (!otherId) return;

    if (!conversations[otherId]) {
      let name = "Customer";
      if (sId === otherId && m.senderId?.name) name = m.senderId.name;
      else if (rId === otherId && m.receiverId?.name) name = m.receiverId.name;
      conversations[otherId] = { name, messages: [] };
    }
    conversations[otherId].messages.push(m);
  });

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 border border-teal-100 p-6 rounded-[2.5rem] mb-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-teal-900">Lunaria Support Center</h2>
          <p className="text-teal-600 text-sm">Manage and respond to support requests in real-time.</p>
        </div>
      </div>

      {Object.keys(conversations).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No support requests yet.</p>
        </div>
      ) : (
        Object.entries(conversations).map(([userId, data]) => (
          <motion.div 
            key={userId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all mb-8"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {data.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{data.name}</h3>
                  <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">ID: {userId.slice(-6)}</p>
                </div>
              </div>
              <span className="bg-white px-4 py-1 rounded-full text-xs text-slate-500 font-medium border border-slate-100">
                {data.messages.length} messages
              </span>
            </div>

            <div className="p-8 h-[450px] overflow-y-auto space-y-4 bg-slate-50/30 custom-scrollbar flex flex-col">
              {data.messages.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((m, i) => {
                const isMe = (m.senderId?._id || m.senderId || "").toString().toLowerCase() === adminId;
                const isEditing = editingId === m._id;
                
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative mb-2`}>
                    {!isMe && (
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[8px] mr-2 self-end mb-1 font-bold text-slate-500">
                        {data.name.charAt(0)}
                      </div>
                    )}
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed relative group shadow-sm ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                    }`}>
                      {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="bg-white/20 text-white border border-white/30 rounded-xl p-2 text-sm outline-none w-full min-h-[60px]"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingId(null)} className="text-[10px] opacity-70 hover:opacity-100">Cancel</button>
                            <button onClick={() => handleUpdateMessage(m._id)} className="text-[10px] font-bold bg-white text-teal-600 px-2 py-1 rounded-lg">Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{m.content}</p>
                          {m.isEdited && <span className="block text-[8px] opacity-50 mt-1 italic">(Edited)</span>}
                          
                          {isMe && (
                            <button 
                              onClick={() => { setEditingId(m._id); setEditContent(m.content); }}
                              className="absolute -top-2 -right-2 bg-white text-teal-600 w-6 h-6 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-teal-100 hover:scale-110 active:scale-90"
                              title="Edit"
                            >
                              <span className="text-[10px]">✎</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
              <input 
                type="text" 
                placeholder={`Type a reply for ${data.name}...`}
                value={replyInput[userId] || ""}
                onChange={(e) => setReplyInput(prev => ({ ...prev, [userId]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleReply(userId)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all outline-none"
              />
              <button 
                onClick={() => handleReply(userId)}
                disabled={sending[userId] || !replyInput[userId]?.trim()}
                className="px-8 py-4 bg-teal-600 text-white rounded-2xl text-sm font-bold hover:bg-teal-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                {sending[userId] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Send
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
