"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function AdminChat() {
  const { isLoggedIn, user, token, isLoading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const isDragging = useRef(false);

  const myId = (user?._id || user?.id || "").toString();

  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

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
      console.error("User side fetch error:", e);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !isLoggedIn || !selectedUserId) return;
    setLoading(true);
    
    let targetId = selectedUserId;
    let isSupport = false;
    if (selectedUserId === "LUNARIA_SUPPORT") {
      isSupport = true;
      // Try to find the actual admin ID from history, fallback to default
      const foundAdmin = messages.find(m => m.isAdminChat && (m.senderId?._id || m.senderId || "").toString() !== myId);
      targetId = foundAdmin ? (foundAdmin.senderId?._id || foundAdmin.senderId).toString() : "65f8a0000000000000000001";
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receiverId: targetId,
          content: message,
          isAdminChat: isSupport
        })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
        setMessage("");
      } else {
        const errData = await res.json();
        alert("Lỗi gửi tin nhắn: " + (errData.message || res.statusText));
      }
    } catch (e) {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMessage = async () => {
    if (!editContent.trim() || !editingId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/messages/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messageId: editingId, content: editContent })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m._id === editingId ? { ...m, content: editContent, isEdited: true } : m));
        setEditingId(null);
        setEditContent("");
      }
    } catch (e) {}
  };

  // Group messages for list view
  const conversations: { [key: string]: any } = {};
  messages.forEach(m => {
    const sId = (m.senderId?._id || m.senderId || "").toString();
    const rId = (m.receiverId?._id || m.receiverId || "").toString();
    
    // If it's an admin chat, force it into a "support" group
    let otherId;
    if (m.isAdminChat) {
      otherId = "LUNARIA_SUPPORT";
    } else {
      otherId = sId === myId ? rId : sId;
    }
    
    if (otherId && otherId !== "undefined") {
      if (!conversations[otherId]) {
        conversations[otherId] = {
          messages: [],
          otherUser: m.isAdminChat ? { name: "Lunaria Support" } : (sId === myId ? m.receiverId : m.senderId)
        };
      }
      conversations[otherId].messages.push(m);
    }
  });

  const chatMessages = messages.filter(m => {
    if (selectedUserId === "LUNARIA_SUPPORT") {
      return m.isAdminChat;
    }
    const sId = (m.senderId?._id || m.senderId || "").toString();
    const rId = (m.receiverId?._id || m.receiverId || "").toString();
    return !m.isAdminChat && ((sId === myId && rId === selectedUserId) || (sId === selectedUserId && rId === myId));
  });

  if (authLoading || !isLoggedIn) return null;

  return (
    <div className="fixed bottom-32 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-80 md:w-96 bg-white dark:bg-[#121214] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-slate-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {view === 'chat' && (
                  <button onClick={() => setView('list')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <X className="w-4 h-4 rotate-90" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-none mb-1">
                    {view === 'list' ? 'Messages' : selectedUserName}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-teal-300 font-black uppercase tracking-[0.1em]">
                      {view === 'list' ? 'LUNARIA MESSAGING' : 'CONVERSATION'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {view === 'list' ? (
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-transparent">
                {Object.keys(conversations).length === 0 && (
                  <div className="text-center py-20 px-6">
                    <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/10">
                      <MessageCircle className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">No conversations yet. Reach out to a Coach or Support!</p>
                  </div>
                )}
                <div className="space-y-2">
                   {(() => {
                     const supportKey = "LUNARIA_SUPPORT";
                     const conv = conversations[supportKey];
                     return (
                       <button 
                         onClick={() => { setSelectedUserId(supportKey); setSelectedUserName("Lunaria Support"); setView('chat'); }}
                         className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-teal-500/30 transition-all text-left shadow-sm group"
                       >
                         <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                           <ShieldCheck className="w-6 h-6" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-sm dark:text-white group-hover:text-teal-600 transition-colors">Lunaria Support</p>
                           <p className="text-[10px] text-slate-400 truncate font-medium">
                             {conv ? conv.messages[conv.messages.length - 1].content : "Having an issue? Message us now"}
                           </p>
                         </div>
                         {conv && (
                           <div className="text-[8px] font-bold text-slate-300 uppercase">
                             {new Date(conv.messages[conv.messages.length - 1].createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </div>
                         )}
                       </button>
                     );
                   })()}
                   
                   {Object.entries(conversations)
                     .filter(([key]) => key !== "LUNARIA_SUPPORT")
                     .map(([uid, data]) => (
                       <button 
                         key={uid}
                         onClick={() => { setSelectedUserId(uid); setSelectedUserName(data.otherUser?.name || `User ${uid.slice(-4)}`); setView('chat'); }}
                         className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-teal-500/30 transition-all text-left shadow-sm group"
                       >
                         <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 font-bold uppercase">
                           {data.otherUser?.name ? data.otherUser.name[0] : <User className="w-6 h-6" />}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-sm dark:text-white truncate group-hover:text-teal-600 transition-colors">{data.otherUser?.name || 'Coach/User'}</p>
                           <p className="text-[10px] text-slate-400 truncate font-medium">{data.messages[data.messages.length - 1].content}</p>
                         </div>
                         <div className="text-[8px] font-bold text-slate-300 uppercase">
                           {new Date(data.messages[data.messages.length - 1].createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                         </div>
                       </button>
                   ))}
                </div>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-transparent">
                  {chatMessages.map((m, i) => {
                    const sId = (m.senderId?._id || m.senderId || "").toString().toLowerCase();
                    const isMe = sId === myId.toLowerCase();
                    const isEditing = editingId === m._id;
                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm relative transition-all ${
                          isMe 
                            ? 'bg-slate-900 text-white rounded-tr-none shadow-lg' 
                            : 'bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-100 rounded-tl-none'
                        }`}>
                          {isEditing ? (
                            <div className="flex flex-col gap-2 min-w-[150px]">
                              <input value={editContent} onChange={(e) => setEditContent(e.target.value)} className="bg-white/10 text-white border border-white/20 rounded-lg p-2 text-xs outline-none w-full" autoFocus />
                              <div className="flex justify-end gap-2"><button onClick={() => setEditingId(null)} className="text-[10px] font-bold opacity-70">Cancel</button><button onClick={handleUpdateMessage} className="text-[10px] font-bold text-teal-400">Save</button></div>
                            </div>
                          ) : (
                            <>
                              <p className="leading-relaxed">{m.content}</p>
                              {m.isEdited && <span className="block text-[8px] opacity-50 mt-1 italic"> (Edited)</span>}
                              <div className={`text-[8px] mt-2 font-bold uppercase tracking-widest opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {isMe && <button onClick={() => { setEditingId(m._id); setEditContent(m.content); }} className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-6 h-6 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-white/10 hover:scale-110"><span className="text-[10px]">✎</span></button>}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-white dark:bg-[#121214] border-t border-slate-100 dark:border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all"
                    />
                    <button onClick={handleSend} disabled={loading || !message.trim()} className="w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onTap={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-16 h-16 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xl transition-shadow relative z-[100] ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageCircle className="w-8 h-8" />
        {messages.length > 0 && (messages[messages.length-1].senderId?._id || messages[messages.length-1].senderId || "").toString() !== myId && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-4 border-white dark:border-slate-900 rounded-full animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}
