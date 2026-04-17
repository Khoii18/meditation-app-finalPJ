import { useState, useEffect } from "react";
import { Loader2, Music, X } from "lucide-react";

export function AdminFormModal({ formData, setFormData, activeTab, showModal, setShowModal, handleSave, existingData }: any) {
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);

  useEffect(() => {
     if (showModal) {
       setIsAddingNewSubject(false);
     }
  }, [showModal]);

  const existingSubjects = Array.from(new Set(
    (existingData || [])
      .filter((d: any) => d.type?.toLowerCase().includes('plan') && d.subject)
      .map((d: any) => d.subject)
  ));

  const handleMediaUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const sigRes = await fetch("http://localhost:5000/api/cloudinary-signature", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!sigRes.ok) throw new Error("Signature fail: " + await sigRes.text());
      const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("api_key", apiKey);
      formDataUpload.append("timestamp", timestamp);
      formDataUpload.append("signature", signature);
      formDataUpload.append("folder", folder);

      const isVideo = activeTab === 'content';
      const endpoint = isVideo ? "/video/upload" : "/auto/upload";
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}${endpoint}`, {
        method: "POST",
        body: formDataUpload
      });
      
      if (!uploadRes.ok) throw new Error("Cloudinary fail: " + await uploadRes.text());
      const data = await uploadRes.json();
      if (data.secure_url) {
        setFormData({ ...formData, audioUrl: data.secure_url });
      } else {
        alert("Upload failed.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error uploading media file: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      const sigRes = await fetch("http://localhost:5000/api/cloudinary-signature", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!sigRes.ok) throw new Error("Signature fail: " + await sigRes.text());
      const { timestamp, signature, folder, cloudName, apiKey } = await sigRes.json();

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("api_key", apiKey);
      formDataUpload.append("timestamp", timestamp);
      formDataUpload.append("signature", signature);
      formDataUpload.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formDataUpload
      });
      
      if (!uploadRes.ok) throw new Error("Cloudinary fail: " + await uploadRes.text());
      const data = await uploadRes.json();
      if (data.secure_url) {
        setFormData({ ...formData, image: data.secure_url });
      } else {
        alert("Upload failed.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error uploading image file: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-lg rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-serif font-bold mb-6">
          {formData._id ? "Edit" : "Add"} {
            activeTab === 'content' ? "Meditation" :
            activeTab === 'soundscapes' ? "Soundscape" :
            activeTab === 'sleep' ? "Sleep Story" :
            activeTab === 'plans' ? "Plan" :
            "Live Session"
          }
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instructor</label>
            <input required value={formData.instructor || ''} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploadingImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
              />
              <div className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors ${formData.image ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 dark:bg-black/20 text-slate-500'}`}>
                <span className="truncate pr-2 text-sm">
                  {uploadingImage ? "Uploading to Cloudinary..." : formData.image ? "Image Selected ✓" : "Click to upload an image"}
                </span>
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <div className="w-4 h-4 border-2 border-current rounded-sm" />}
              </div>
            </div>
            {formData.image && (
               <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover mt-2 rounded-lg border border-white/10" />
            )}
          </div>
           {(activeTab === 'content' || activeTab === 'soundscapes' || activeTab === 'sleep' || activeTab === 'plans') ? (
             <>
                <div>
                  <label className="block text-sm font-medium mb-1">Category / Type</label>
                  <input 
                    required 
                    value={formData.type || ''} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" 
                    placeholder={
                      activeTab === 'sleep' ? "e.g. Sleep Story" : 
                      activeTab === 'soundscapes' ? "e.g. Soundscape" :
                      activeTab === 'plans' ? "Plan" : 
                      "Meditation, Breathwork, Focus..."
                    } 
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input required value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="e.g. 45 min" />
                  </div>
                  
                  {activeTab === 'plans' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Subject / Category Header</label>
                      {isAddingNewSubject || existingSubjects.length === 0 ? (
                         <div className="flex gap-2">
                           <input required value={formData.subject || ''} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="e.g. Morning Meditations" autoFocus />
                           {existingSubjects.length > 0 && (
                             <button type="button" onClick={() => { setIsAddingNewSubject(false); setFormData({...formData, subject: existingSubjects[0]})}} className="px-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                               <X className="w-4 h-4 text-slate-500" />
                             </button>
                           )}
                         </div>
                      ) : (
                         <select 
                           required 
                           value={formData.subject || (existingSubjects.includes(formData.subject) ? formData.subject : existingSubjects[0]) || ''} 
                           onChange={e => {
                             if (e.target.value === '__NEW__') {
                               setIsAddingNewSubject(true);
                               setFormData({...formData, subject: ''});
                             } else {
                               setFormData({...formData, subject: e.target.value});
                             }
                           }} 
                           className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 appearance-none bg-transparent"
                         >
                           {/* Add empty option if form data is empty initially to force selection */}
                           {!formData.subject && <option value="" disabled>Select a subject</option>}
                           {existingSubjects.map(sub => <option key={sub as string} value={sub as string} className="dark:bg-slate-800">{sub}</option>)}
                           <option value="__NEW__" className="dark:bg-slate-800 text-indigo-500 font-medium">+ Add new category</option>
                         </select>
                      )}
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      {activeTab === 'content' ? "Video MP4 File" : "Audio MP3 File"}
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept={activeTab === 'content' ? "video/*" : "audio/*"}
                        onChange={handleMediaUpload} 
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                      />
                      <div className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors ${formData.audioUrl ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 dark:bg-black/20 text-slate-500'}`}>
                        <span className="truncate pr-2 text-sm">
                          {uploading ? "Uploading media..." : formData.audioUrl ? "Media Linked ✓" : `Click to upload ${activeTab === 'content' ? '.mp4' : '.mp3'}`}
                        </span>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <Music className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </div>
              </>
          ) : (
             <>
               <div>
                 <label className="block text-sm font-medium mb-1">Time</label>
                 <input required value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20" placeholder="18:00" />
               </div>
               <div className="flex items-center gap-3">
                 <label className="text-sm font-medium">Is Live Now?</label>
                 <input type="checkbox" checked={formData.isLive || false} onChange={e => setFormData({...formData, isLive: e.target.checked})} className="w-5 h-5" />
               </div>
             </>
          )}
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 rounded-xl font-medium">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
