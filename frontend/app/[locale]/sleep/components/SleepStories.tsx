"use client";

import { Headphones } from "lucide-react";

export function SleepStories() {
  const stories = [
    { title: "Chuyến tàu đêm Xuyên Tuyết", duration: "45 min", type: "Story", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600" },
    { title: "Bí mật của rừng đom đóm", duration: "30 min", type: "Story", image: "https://images.unsplash.com/photo-1505506874110-6a7a4c98f731?q=80&w=600" },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <Headphones className="w-5 h-5 text-indigo-400" /> Truyện Ru Ngủ
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story, i) => (
          <div key={i} className="group cursor-pointer relative rounded-[2.5rem] overflow-hidden aspect-[16/9] md:aspect-video bg-indigo-900/50">
            <img src={story.image} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8">
              <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded mb-3 inline-block">
                {story.type}
              </span>
              <h3 className="text-2xl font-serif mb-1">{story.title}</h3>
              <p className="text-white/60 text-sm">{story.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
