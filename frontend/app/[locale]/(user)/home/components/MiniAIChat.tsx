"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, User, Bot, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { API_URL } from "@/config";
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
      const apiUrl = `${API_URL}/api/ai-coach/chat`;
      console.log("Calling Chatbot API:", apiUrl);
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Chatbot Response:", data);
        setChat(prev => [...prev, { 
          role: "bot", 
          text: data.message || "I am here to guide you.",
          recommendation: data.recommendation,
          suggestedId: data.suggestedId
        }]);
      } else {
        const errorText = await res.text();
        console.error("Chatbot API Error:", res.status, errorText);
        setChat(prev => [...prev, { 
          role: "bot", 
          text: `The sanctuary is currently quiet (Error ${res.status}). Please try again in a moment.` 
        }]);
      }
    } catch (err: any) {
      console.error("Chatbot Fetch Exception:", err);
      setChat(prev => [...prev, { role: "bot", text: "Connection to Lunaria lost. Please check your internet." }]);
      setChat(prev => [...prev, { role: "bot", text: "Connection to Lunaria lost." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="bg-surface rounded-[2rem] border border-border shadow-sm flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-foreground leading-none mb-0.5">Lunaria AI</h3>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-muted uppercase tracking-wider">Active Guide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 scrollbar-hide bg-background/30"
        >
          {chat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-2">
              <Sparkles className="w-6 h-6 text-teal-400 mb-2 opacity-50" />
              <p className="text-[10px] text-muted italic">Ask anything about your path...</p>
            </div>
          ) : (
            chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                  msg.role === "user" ? "bg-teal-600 text-white" : "bg-white border border-border text-foreground"
                }`}>
                  {msg.text}
                  {msg.suggestedId && (
                    <Link href={`./play/${msg.suggestedId}`} className="block mt-2 p-1.5 bg-teal-500/10 rounded-lg text-[9px] font-bold text-teal-600 hover:bg-teal-500/20 transition-all border border-teal-500/20">
                      View Practice →
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-border p-2 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce delay-100" />
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-surface border-t border-border">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 transition-all"
            />
            <button 
              type="submit"
              disabled={loading || !message.trim()}
              className="w-8 h-8 bg-teal-600 hover:bg-teal-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
