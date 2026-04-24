"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, User, Bot, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function MiniAIChat() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "bot"; text: string; recommendation?: string; suggestedId?: string }[]>([
    { role: "bot", text: "How are you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setChat(prev => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai-coach/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setChat(prev => [...prev, { 
          role: "bot", 
          text: data.message || "I am here to guide you.",
          recommendation: data.recommendation,
          suggestedId: data.suggestedId
        }]);
      } else {
        setChat(prev => [...prev, { role: "bot", text: "I'm sorry, I'm having trouble connecting right now." }]);
      }
    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { role: "bot", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-sm flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-foreground">Lunaria AI</h4>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Active Guide</span>
              </div>
            </div>
          </div>
          <button className="text-muted hover:text-foreground transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 p-5 overflow-y-auto space-y-4 scroll-smooth min-h-[250px] max-h-[350px] bg-background/30"
        >
          {chat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/5 flex items-center justify-center text-teal-500 mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <p className="text-sm text-foreground font-medium mb-1">Hello, I am Lunaria.</p>
              <p className="text-xs text-muted">How can I support your mindfulness today?</p>
            </div>
          ) : (
            chat.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-surface border border-border text-foreground rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                  {msg.recommendation && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1">Recommendation</p>
                      <p className="text-xs italic opacity-90">{msg.recommendation}</p>
                      {msg.suggestedId && (
                        <button 
                          onClick={() => window.location.href = `./play/${msg.suggestedId}`}
                          className="mt-2 w-full py-1.5 bg-teal-500/10 text-teal-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-teal-500 hover:text-white transition-all"
                        >
                          Try this session
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" />
                <span className="text-xs text-muted">Listening...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-surface">
          <div className="relative flex items-center gap-2">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
