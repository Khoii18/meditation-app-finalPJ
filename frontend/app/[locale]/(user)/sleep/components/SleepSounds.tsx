import { Music, CloudRain, Wind, Flame, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function SleepSounds() {
  const [sounds, setSounds] = useState<any[]>([]);
  const { claimedRewards, isPaid } = useAuth();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content");
        if (res.ok) {
          const data = await res.json();
          const soundscapes = data.filter((d: any) => d.type.toLowerCase() === "sound" || d.type.toLowerCase() === "soundscape" || d.title.toLowerCase().includes("sound"));
          
          if (soundscapes.length > 0) {
            setSounds(soundscapes.slice(0, 8));
          } else {
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
      <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-500 mb-6 flex items-center gap-2">
        <Music className="w-4 h-4 text-teal-500" /> Immersive Sounds
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sounds.map((s, i) => {
          const isLocked = s.unlockedByStreak && !claimedRewards.includes(s.unlockedByStreak) && !isPaid;
          const href = isLocked ? "#" : `./play/${s._id}`;

          return (
            <Link href={href} key={s._id || i} className={isLocked ? "cursor-not-allowed" : ""}>
              <motion.div 
                whileHover={{ scale: isLocked ? 1 : 1.03 }}
                whileTap={{ scale: isLocked ? 1 : 0.98 }}
                className={`h-full bg-[#1C2028] border border-[#252A36] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden group shadow-sm ${
                  isLocked ? "bg-opacity-50" : "hover:bg-[#252A36] cursor-pointer"
                }`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-1 border border-white/5">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Streak Reward</span>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-full bg-[#111115] text-teal-400 flex items-center justify-center border border-white/5 transition-transform shadow-inner ${!isLocked && "group-hover:scale-110"}`}>
                  {getIcon(s.title)}
                </div>
                <div className="text-center">
                   <p className="text-xs font-bold text-slate-300 mb-0.5">{s.title}</p>
                   {s.unlockedByStreak && !isLocked && (
                     <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest">Unlocked</p>
                   )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
