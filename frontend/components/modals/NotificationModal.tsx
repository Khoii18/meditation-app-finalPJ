"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Sparkles, MessageCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { user, token, refetch } = useAuth();
  
  const [settings, setSettings] = useState({
    dailyReminders: true,
    newContent: true,
    communityActivity: false,
    systemUpdates: true
  });

  useEffect(() => {
    if (user?.settings?.notifications) {
      setSettings(user.settings.notifications);
    }
  }, [user, isOpen]);

  const toggle = async (key: keyof typeof settings) => {
    const newVal = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newVal }));

    try {
      await fetch("http://localhost:5000/api/users/me/settings-ui", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          notifications: { [key]: newVal }
        })
      });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const groups = [
    { 
      title: "Reminders", 
      items: [
        { id: "dailyReminders", name: "Daily Reminders", icon: <Bell className="w-4 h-4 text-indigo-500" />, desc: "Session alerts." },
      ]
    },
    { 
      title: "Content", 
      items: [
        { id: "newContent", name: "New Content", icon: <Sparkles className="w-4 h-4 text-amber-500" />, desc: "New stories & paths." },
        { id: "systemUpdates", name: "System Updates", icon: <Info className="w-4 h-4 text-teal-500" />, desc: "Account news." },
      ]
    },
    { 
      title: "Social", 
      items: [
        { id: "communityActivity", name: "Community", icon: <MessageCircle className="w-4 h-4 text-rose-500" />, desc: "Social alerts." },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-end p-4 md:p-8 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl pointer-events-auto overflow-hidden mt-16 md:mt-0"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-medium text-lg text-foreground">Notifications</h3>
              <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {groups.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-2 opacity-60">{group.title}</h4>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-background transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center border border-border">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-foreground leading-tight">{item.name}</h5>
                            <p className="text-[11px] text-muted">{item.desc}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggle(item.id as keyof typeof settings)}
                          className={`w-10 h-5 rounded-full p-1 transition-all relative ${
                            settings[item.id as keyof typeof settings] ? "bg-indigo-600 shadow-md shadow-indigo-500/20" : "bg-background border border-border"
                          }`}
                        >
                          <motion.div 
                            animate={{ x: settings[item.id as keyof typeof settings] ? 20 : 0 }}
                            className={`w-3 h-3 rounded-full ${settings[item.id as keyof typeof settings] ? "bg-white" : "bg-muted"}`} 
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-background border-t border-border">
               <p className="text-[10px] text-center text-muted italic">Settings are synced to your account.</p>
            </div>
          </motion.div>
          
          {/* Backdrop to close */}
          <div className="fixed inset-0 -z-10 pointer-events-auto" onClick={onClose} />
        </div>
      )}
    </AnimatePresence>
  );
}
