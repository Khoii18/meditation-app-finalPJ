"use client";

import { Music, CloudRain, Wind, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export function SleepSounds() {
  const [sounds, setSounds] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content");
        if (res.ok) {
          const data = await res.json();
          const soundscapes = data.filter((d: any) => d.type.toLowerCase() === "soundscape" || d.title.toLowerCase().includes("sound"));
          
          if (soundscapes.length > 0) {
            setSounds(soundscapes.slice(0, 4));
          } else {
            // Fallback default structure mapped perfectly to DB shape just in case empty dataset
            setSounds([
              { title: "Heavy Rain", _id: "v1" },
              { title: "Campfire", _id: "v2" },
              { title: "Forest Wind", _id: "v3" },
              { title: "Gentle Waves", _id: "v4" },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("rain") || t.includes("storm") || t.includes("water")) return <CloudRain className="w-6 h-6"/>;
    if (t.includes("fire") || t.includes("camp")) return <Flame className="w-6 h-6"/>;
    if (t.includes("wind") || t.includes("breeze")) return <Wind className="w-6 h-6"/>;
    return <Music className="w-6 h-6"/>;
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-12"
    >
      <h2 className="text-xl font-medium text-white mb-6">Mix Soundscapes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sounds.map((s, i) => (
          <Link href={`./play/${s._id}`} key={s._id || i}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-indigo-900/40 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getIcon(s.title)}
              </div>
              <span className="text-sm font-medium text-slate-200 text-center">{s.title}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
