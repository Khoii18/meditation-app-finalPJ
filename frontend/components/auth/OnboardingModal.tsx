"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Moon, Award, Sun, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const GOALS = [
  { id: "stress", label: "Reduce Stress", icon: <Target className="w-6 h-6 mb-2 text-teal-600" /> },
  { id: "sleep", label: "Improve Sleep", icon: <Moon className="w-6 h-6 mb-2 text-indigo-500" /> },
  { id: "focus", label: "Increase Focus", icon: <Award className="w-6 h-6 mb-2 text-amber-500" /> },
  { id: "mood", label: "Improve Mood", icon: <Sun className="w-6 h-6 mb-2 text-rose-400" /> }
];

const EXPERIENCE = [
  { id: "new", label: "New to meditation" },
  { id: "tried", label: "Tried it once or twice" },
  { id: "occasional", label: "Meditate occasionally" },
  { id: "often", label: "Meditate often" }
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Only show if user is logged in but hasn't completed onboarding
    const token = localStorage.getItem("token");
    const hasCompleted = localStorage.getItem("oasis_onboarded");
    
    if (token && !hasCompleted) {
      setTimeout(() => setIsOpen(true), 1500); // 1.5s delay to let home page load first
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("oasis_onboarded", "true");
    setIsOpen(false);
  };

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(g => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0A0F1C]/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-sm bg-[#F2FBFA] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col min-h-[600px] border border-white"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-teal-100">
            <motion.div 
              className="h-full bg-teal-500"
              initial={{ width: "50%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col">
            <button onClick={handleComplete} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            {step === 1 ? (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="text-center mt-6 mb-8">
                  <h2 className="text-2xl font-serif text-slate-800 mb-2">Select all the goals<br/>that matter to you.</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {GOALS.map((goal) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`
                          flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-200 bg-white
                          ${isSelected ? 'border-teal-500 shadow-[0_4px_15px_rgba(13,148,136,0.15)] shadow-teal-500/20' : 'border-teal-50 hover:border-teal-200'}
                        `}
                      >
                        <div className="relative mb-2">
                           {goal.icon}
                           {isSelected && (
                             <div className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                               <Check className="w-3 h-3 text-white" strokeWidth={3} />
                             </div>
                           )}
                        </div>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-teal-700' : 'text-slate-500'}`}>
                          {goal.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6">
                  <button 
                    disabled={selectedGoals.length === 0}
                    onClick={() => setStep(2)}
                    className="w-full uppercase text-xs tracking-widest font-bold text-teal-600 py-4 hover:bg-teal-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    Tap to Continue
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="text-center mt-6 mb-8">
                  <h2 className="text-2xl font-serif text-slate-800 mb-2">What best describes your meditation experience?</h2>
                </div>
                
                <div className="flex flex-col gap-3 flex-1">
                  {EXPERIENCE.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        setExperience(exp.id);
                        setTimeout(handleComplete, 500); // Auto complete on selection for fluid UX
                      }}
                      className={`
                        flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200
                        ${experience === exp.id ? 'bg-teal-50 border-teal-500' : 'bg-white border-transparent hover:border-teal-100'}
                      `}
                    >
                      <span className={`font-semibold text-sm ${experience === exp.id ? 'text-teal-700' : 'text-slate-600'}`}>{exp.label}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-teal-200 flex items-center justify-center">
                         {experience === exp.id && <div className="w-3 h-3 rounded-full bg-teal-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
