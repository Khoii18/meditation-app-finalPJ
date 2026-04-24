import { useState, useEffect } from "react";
import { Loader2, Music, X, Plus, Trash2 } from "lucide-react";
import { API_URL } from "@/config";

export function AdminFormModal({ formData, setFormData, activeTab, showModal, setShowModal, handleSave, existingData }: any) {
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);

  useEffect(() => {
     if (showModal) {
       setIsAddingNewSubject(false);
       if (!formData.lessons) {
         setFormData((prev: any) => ({ ...prev, lessons: [] }));
       }
     }
  }, [showModal]);

  const handleLessonChange = (index: number, field: string, value: string) => {
    const updatedLessons = [...(formData.lessons || [])];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [...(formData.lessons || []), { title: '', duration: '', description: '', audioUrl: '' }]
    });
  };

  const removeLesson = (index: number) => {
    const updatedLessons = [...(formData.lessons || [])];
    updatedLessons.splice(index, 1);
    setFormData({ ...formData, lessons: updatedLessons });
  };

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
      const sigRes = await fetch(`${API_URL}/api/cloudinary-signature`, {
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

      const isVideo = false; // We use audio for all now as requested by user
      const endpoint = "/auto/upload";
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
      const sigRes = await fetch(`${API_URL}/api/cloudinary-signature`, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif font-bold mb-6 text-slate-800">
          {formData._id ? "Edit" : "Add"} {
            activeTab === 'content' ? "Meditation" :
            activeTab === 'soundscapes' ? "Soundscape" :
            activeTab === 'sleep' ? "Sleep Story" :
            activeTab === 'plans' ? "Plan" : ""
          }
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Title</label>
            <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 rounded-2xl border border-teal-100 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all" />
          </div>
          {/* Free / Premium toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-teal-100 bg-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-700">Access Level</p>
              <p className="text-[11px] text-slate-400 font-medium">
                {formData.isPremium ? "🔒 Premium — requires subscription" : "🆓 Free — everyone can access"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({...formData, isPremium: !formData.isPremium})}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${formData.isPremium ? 'bg-amber-400' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${formData.isPremium ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
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
                           {!formData.subject && <option value="" disabled>Select a subject</option>}
                           {existingSubjects.map(sub => <option key={sub as string} value={sub as string} className="dark:bg-slate-800">{String(sub)}</option>)}
                           <option value="__NEW__" className="dark:bg-slate-800 text-indigo-500 font-medium">+ Add new category</option>
                         </select>
                      )}
                    </div>
                  )}
                  
                  {activeTab !== 'plans' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Audio MP3 File
                      </label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="audio/*"
                          onChange={handleMediaUpload} 
                          disabled={uploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
                        />
                        <div className={`w-full p-3 rounded-xl border flex items-center justify-between transition-colors ${formData.audioUrl ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 dark:bg-black/20 text-slate-500'}`}>
                          <span className="truncate pr-2 text-sm">
                            {uploading ? "Uploading media..." : formData.audioUrl ? "Media Linked ✓" : `Click to upload .mp3`}
                          </span>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <Music className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description / Intro Text</label>
                  <textarea 
                    value={formData.description || ''} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 min-h-[100px]" 
                    placeholder="Enter description or intro text here..." 
                  />
                </div>

                {activeTab === 'plans' && (
                  <div className="mt-6 border-t pt-4 border-slate-200 dark:border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-700">Plan Lessons</h3>
                      <button type="button" onClick={addLesson} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-medium">
                        <Plus className="w-4 h-4" /> Add Lesson
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(formData.lessons || []).map((lesson: any, idx: number) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group">
                          <button type="button" onClick={() => removeLesson(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-slate-500">Lesson Title</label>
                              <input 
                                value={lesson.title || ''} 
                                onChange={e => handleLessonChange(idx, 'title', e.target.value)} 
                                className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-white" 
                                placeholder="e.g. Day 1: Introduction" 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1 text-slate-500">Duration</label>
                              <input 
                                value={lesson.duration || ''} 
                                onChange={e => handleLessonChange(idx, 'duration', e.target.value)} 
                                className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-white" 
                                placeholder="e.g. 10 min" 
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs font-medium mb-1 text-slate-500">Description</label>
                            <textarea 
                              value={lesson.description || ''} 
                              onChange={e => handleLessonChange(idx, 'description', e.target.value)} 
                              className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-white min-h-[60px]" 
                              placeholder="Lesson description..." 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-slate-500">Audio URL (Optional)</label>
                            <input 
                              value={lesson.audioUrl || ''} 
                              onChange={e => handleLessonChange(idx, 'audioUrl', e.target.value)} 
                              className="w-full p-2 text-sm rounded-lg border border-slate-200 bg-white" 
                              placeholder="Paste audio URL here or upload later" 
                            />
                          </div>
                        </div>
                      ))}
                      {(!formData.lessons || formData.lessons.length === 0) && (
                        <p className="text-sm text-slate-500 text-center py-4 italic">No lessons added yet. Click "Add Lesson" to start building this plan.</p>
                      )}
                    </div>
                  </div>
                )}
              </>
          ) : null}
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-md shadow-teal-500/20 transition-all">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
