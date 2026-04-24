"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/config";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (updatedUser: any) => void;
}

export function AccountSettingsModal({ isOpen, onClose, user, onUpdate }: AccountSettingsModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/me/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          ...(newPassword ? { password: newPassword, currentPassword } : {})
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        onUpdate(data);
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } else {
        setError(data || "Failed to update account");
      }
    } catch (err: any) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Account Settings</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition-all"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">Change Password</h4>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2 ml-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition-all"
                        placeholder="••••••••"
                        required={newPassword.length > 0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-teal-500 transition-all"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    success 
                      ? "bg-emerald-500 text-white" 
                      : "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Changes Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
