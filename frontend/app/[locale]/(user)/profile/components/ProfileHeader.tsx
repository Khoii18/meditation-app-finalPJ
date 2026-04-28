"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, Star } from "lucide-react";

export function ProfileHeader() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    // First load from local then sync with server
    const localData = localStorage.getItem("user");
    if (localData) setUser(JSON.parse(localData));
    
    fetchUser();
  }, []);

  const name = user?.name || "Guest";
  const initial = name.charAt(0).toUpperCase();

  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const sigRes = await fetch("http://localhost:5000/api/cloudinary/signature", { headers: { Authorization: `Bearer ${token}` } });
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();
      
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("api_key", apiKey);
      formDataUpload.append("timestamp", timestamp);
      formDataUpload.append("signature", signature);
      formDataUpload.append("folder", "avatars");

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST", body: formDataUpload
      });
      const data = await uploadRes.json();
      
      if (data.secure_url) {
        const res = await fetch("http://localhost:5000/api/users/me/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ avatar: data.secure_url })
        });
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 mb-8 bg-surface p-8 rounded-[2.5rem] border border-border shadow-sm transition-colors duration-500">
      <div className="relative group w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-serif uppercase shadow-inner overflow-hidden">
        {user?.avatar && user.avatar !== "" ? (
          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          initial
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <input type="file" accept="image/*" disabled={uploading} onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-serif font-medium text-foreground">{name}</h1>
          {user?.premiumStatus?.isPremium && (
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
               <Star className="w-3 h-3 fill-current" /> Premium {user?.premiumStatus?.planType}
            </span>
          )}
        </div>
        <p className="text-muted mt-1">{user?.email || "No email updated"}</p>
        
        {user?.premiumStatus?.isPremium ? (
          <div className="mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full inline-block">
             Plan active until {new Date(user.premiumStatus.expiryDate).toLocaleDateString()}
          </div>
        ) : (
          <button 
            onClick={() => {
              const locale = window.location.pathname.split('/')[1] || 'vi';
              window.location.href = `/${locale}/pricing`;
            }}
            className="mt-3 text-sm font-semibold text-indigo-500 hover:text-white hover:bg-indigo-500 border border-indigo-500 bg-transparent px-6 py-1.5 rounded-full transition-all outline-none"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
}
