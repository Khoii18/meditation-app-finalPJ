"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { MOCK_ROUTINES } from "../data/mockData";

export function SinglesList() {
  return (
    <section className="mt-8 mb-6">
      <div className="px-6 mb-4 flex justify-between items-end">
        <h3 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100">Singles</h3>
        <button className="text-sm text-indigo-500 font-medium hover:underline">View All</button>
      </div>
      
      <div className="flex gap-4 px-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {MOCK_ROUTINES.map((routine) => (
          <Link href={`./play/${routine.id}`} key={routine.id} className="min-w-[160px] max-w-[160px] snap-start group flex flex-col gap-3">
            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm">
              <img 
                src={routine.image} 
                alt={routine.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </button>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">{routine.type}</p>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight mb-1">{routine.title}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">{routine.duration}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
