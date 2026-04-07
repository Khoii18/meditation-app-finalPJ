"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Calendar, User, MessageCircle, X, ChevronRight, 
  Activity, Flame, Clock, Star, Crown, Send, Settings, Bell, Headset 
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_METRICS = {
  activePlan: "Nền tảng Tĩnh Thức",
  dayStreak: 12,
  totalMinutes: 340,
  sessionsCompleted: 18,
  heartRate: 68,
  focusScore: 85
};

const MOCK_ROUTINES = [
  { id: 1, title: "Giảm căng thẳng cuối ngày", duration: "10 min", instructor: "Cô Linh", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop", type: "Thiền định" },
  { id: 2, title: "Ngủ sâu và phục hồi", duration: "25 min", instructor: "Thầy Minh", image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop", type: "Thư giãn" },
  { id: 3, title: "Tập trung năng lượng sáng", duration: "15 min", instructor: "Cô Hà", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?q=80&w=800&auto=format&fit=crop", type: "Hô hấp" },
  { id: 4, title: "Buông bỏ phiền muộn", duration: "20 min", instructor: "Master Trần", image: "https://images.unsplash.com/photo-1499810631641-541e76d678a2?q=80&w=800&auto=format&fit=crop", type: "Tâm thức" },
];

const MOCK_SCHEDULE = [
  { time: "18:00 Hôm nay", title: "Thiền thư giãn cơ sâu", instructor: "Trực tiếp cùng Cô Linh", status: "Sắp diễn ra" },
  { time: "20:30 Hôm nay", title: "Sound Healing (Chuông xoay)", instructor: "Master Trần", status: "Còn chỗ" },
];

const MOCK_MEMBERSHIPS = [
  { id: "basic", name: "Khởi Đầu", price: "499K", period: "/tháng", features: ["1 Buổi PT/tuần", "Lộ trình cá nhân hóa", "Hỏi đáp qua tin nhắn"], color: "from-slate-700 to-slate-800", icon: <Star className="w-6 h-6 text-slate-300" /> },
  { id: "pro", name: "Cân Bằng", price: "999K", period: "/tháng", features: ["3 Buổi PT/tuần", "Chỉnh sửa tư thế live", "Hỗ trợ 24/7", "Truy cập mọi âm thanh"], isPopular: true, color: "from-indigo-600 to-violet-700", icon: <Crown className="w-6 h-6 text-amber-300" /> },
  { id: "vip", name: "Thức Tỉnh", price: "1.990K", period: "/tháng", features: ["PT đồng hành mỗi ngày", "Tư vấn dinh dưỡng", "Tham gia Office Workshop", "Lớp 1 kèm 1 đặc biệt"], color: "from-rose-600 to-orange-600", icon: <Activity className="w-6 h-6 text-rose-200" /> }
];

export default function HomeDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "bot", text: "Namaste 🙏 Tôi là trợ lý ảo Mindful, tôi có thể tư vấn gói tập hoặc chọn video phù hợp cho bạn hôm nay." }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setChatLog([...chatLog, { role: "user", text: message }]);
    setMessage("");

    // Simulate bot response
    setTimeout(() => {
      setChatLog(prev => [...prev, { role: "bot", text: "Tôi hiểu rồi. Bạn hãy thử bài 'Giảm căng thẳng cuối ngày' nhé, rất phù hợp với tâm trạng của bạn hiện tại đấy!" }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Oasis</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
        
        {/* UPPER SECTION: Greeting & Live Metrics */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-slate-800 dark:text-white">
              Chào buổi tối, Roy.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Hôm nay tâm trí bạn cảm thấy thế nào?</p>
            
            {/* HERO CARD (Your Plan) */}
            <div className="relative overflow-hidden rounded-[2rem] p-8 mt-4 group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 z-0" />
              <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105 z-0"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 text-xs font-semibold mb-4 uppercase tracking-wider">
                    Lộ trình của bạn
                  </span>
                  <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">{MOCK_METRICS.activePlan}</h2>
                  <p className="text-indigo-200/80 max-w-sm">Ngày 4: Xây dựng nhận thức về hơi thở qua từng nhịp điệu của âm thanh.</p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <button className="flex items-center gap-2 bg-white text-indigo-950 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-xl shadow-white/10">
                    <Play className="w-5 h-5 fill-current" />
                    Tập ngay (15')
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE METRICS SIDEBAR */}
          <div className="flex flex-col gap-4 justify-end">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Chỉ số cơ thể & Hiệu suất</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between aspect-square">
                <Flame className="w-6 h-6 text-orange-500 mb-2" />
                <div>
                  <div className="text-3xl font-semibold text-slate-800 dark:text-white">{MOCK_METRICS.dayStreak}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Ngày liên tục</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between aspect-square">
                <Clock className="w-6 h-6 text-indigo-500 mb-2" />
                <div>
                  <div className="text-3xl font-semibold text-slate-800 dark:text-white">{MOCK_METRICS.totalMinutes}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Phút thiền định</div>
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm flex flex-col justify-between aspect-square">
                <Activity className="w-6 h-6 text-rose-500 mb-2" />
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-indigo-900 dark:text-indigo-100">{MOCK_METRICS.heartRate}</span>
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">bpm</span>
                  </div>
                  <div className="text-xs text-indigo-600/70 dark:text-indigo-400 uppercase tracking-wider mt-1">Nhịp tim Live</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between aspect-square">
                <Star className="w-6 h-6 text-amber-500 mb-2" />
                <div>
                  <div className="text-3xl font-semibold text-slate-800 dark:text-white">{MOCK_METRICS.focusScore}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Điểm tập trung</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEOS ROW */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Bài tập gợi ý</h2>
              <p className="text-slate-500 text-sm mt-1">Dựa trên mục tiêu giảm căng thẳng của bạn</p>
            </div>
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Xem tất cả</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {MOCK_ROUTINES.map((routine) => (
              <div key={routine.id} className="min-w-[280px] snap-start group cursor-pointer relative overflow-hidden rounded-[1.5rem]">
                <div className="aspect-[4/5] relative">
                  <div className="absolute inset-0 bg-slate-900" />
                  <img src={routine.image} alt={routine.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                  
                  {/* Content Over image */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        {routine.type}
                      </span>
                      <button className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/20 transform opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 leading-tight group-hover:text-indigo-200 transition-colors">{routine.title}</h3>
                      <p className="text-white/70 text-sm flex items-center gap-2">
                        <span>{routine.duration}</span> • <span>{routine.instructor}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMBINED: SCHEDULE & MEMBERSHIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LIVE SCHEDULE */}
          <section className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Lịch Live Session
            </h2>
            <div className="space-y-4">
              {MOCK_SCHEDULE.map((session, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                      {session.time}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {session.status}
                    </span>
                  </div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-1">{session.title}</h4>
                  <p className="text-xs text-slate-500">{session.instructor}</p>
                  <button className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-800 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    Đăng ký tham gia
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* MEMBERSHIPS / PT CONNECT */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
              Thuê Huấn Luyện Viên Cá Nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_MEMBERSHIPS.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`relative rounded-[2rem] p-1 overflow-hidden ${plan.isPopular ? 'bg-gradient-to-b from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/20 md:-translate-y-2' : 'bg-transparent'}`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 inset-x-0 mx-auto w-max px-3 py-1 bg-white dark:bg-slate-900 text-xs font-bold uppercase rounded-b-lg text-indigo-600 dark:text-indigo-400 z-10 shadow-sm border border-t-0 border-indigo-100 dark:border-slate-800">
                      Gợi ý nhất
                    </div>
                  )}
                  <div className={`h-full w-full bg-gradient-to-br ${plan.color} rounded-[1.8rem] p-6 flex flex-col relative overflow-hidden text-white`}>
                    <div className="absolute top-0 right-0 p-6 opacity-30 transform translate-x-4 -translate-y-4">
                      {plan.icon}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1 relative z-10">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6 relative z-10">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-white/70 text-sm">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1 relative z-10">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="text-sm text-white/90 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-3 rounded-xl font-semibold relative z-10 transition-transform hover:scale-105 active:scale-95 ${plan.isPopular ? 'bg-white text-indigo-600' : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'}`}>
                      Chọn Gói
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>

      {/* --- FLOATING CHATBOT --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-[350px] mb-4 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Headset className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Mindful Assitant</h4>
                    <p className="text-[10px] text-white/70">Sẵn sàng hỗ trợ 24/7</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 h-[350px] overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col gap-4 text-sm">
                {chatLog.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hỏi về khóa học, sức khỏe..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-colors"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>
      </div>

    </div>
  );
}
