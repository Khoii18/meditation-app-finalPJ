export const MOCK_METRICS = {
  activePlan: "Foundations",
  dayStreak: 12,
  totalMinutes: 340,
  sessionsCompleted: 18,
  heartRate: 68,
  focusScore: 85,
  currentDay: 4,
  totalDays: 10
};

export const MOCK_ROUTINES = [
  { id: 1, title: "Stress Relief", duration: "10 min", instructor: "Ms. Linh", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", type: "Meditation" },
  { id: 2, title: "Deep Sleep & Recovery", duration: "25 min", instructor: "Master Minh", image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop", type: "Relaxation" },
  { id: 3, title: "Focus Session", duration: "15 min", instructor: "Ms. Ha", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=800&auto=format&fit=crop", type: "Breathwork" },
  { id: 4, title: "Letting Go", duration: "20 min", instructor: "Master Tran", image: "https://images.unsplash.com/photo-1499810631641-541e76d678a2?q=80&w=800&auto=format&fit=crop", type: "Mindfulness" },
];

export const MOCK_SCHEDULE = [
  { time: "18:00", title: "Deep Relaxation Meditation", instructor: "Ms. Linh", status: "Upcoming" },
  { time: "20:30", title: "Sound Healing", instructor: "Master Tran", status: "Available" },
];
