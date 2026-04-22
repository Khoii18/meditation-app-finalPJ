"use client";

import { useState } from "react";
import { CheckCircle2, Star, Loader2, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const plans = [
    { id: "monthly", name: "Monthly", price: 2000, displayPrice: "2.000₫", period: "/tháng", desc: "Dành cho những người mới bắt đầu.", popular: false, color: "bg-white", border: "border-teal-100", text: "text-slate-800", btn: "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200" },
    { id: "annual", name: "Annual", price: 990000, displayPrice: "990.000₫", period: "/năm", desc: "Tiết kiệm nhất. Cam kết lâu dài.", popular: true, color: "bg-teal-600", border: "border-transparent", text: "text-white", btn: "bg-white text-teal-700 shadow-md hover:bg-slate-50" },
    { id: "lifetime", name: "Lifetime", price: 2990000, displayPrice: "2.990.000₫", period: " một lần", desc: "Truy cập trọn đời tất cả tính năng.", popular: false, color: "bg-slate-50", border: "border-teal-100/50", text: "text-slate-800", btn: "bg-teal-600 text-white hover:bg-teal-700" },
  ];

  const handlePayment = async (plan: any) => {
     try {
       setLoading(plan.id);
       const token = localStorage.getItem("token");
       
       const response = await fetch("http://localhost:5000/api/payment/create-qr", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         },
         body: JSON.stringify({
           amount: plan.price,
           planId: plan.id, // Gửi mã gói (monthly, annual, lifetime)
           description: `Oasis ${plan.name} Subscription`
         })
       });

       const result = await response.json();
       if (result.success) {
         setPaymentData(result.data);
       }
     } catch (error) {
       console.error("Payment error:", error);
     } finally {
       setLoading(null);
     }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
      {plans.map((plan, idx) => (
        <div key={idx} className={`relative flex flex-col p-8 rounded-[2.5rem] border shadow-sm ${plan.color} ${plan.border} ${plan.text} ${plan.popular ? 'scale-105 z-10 shadow-xl shadow-teal-600/10' : ''}`}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-800 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-teal-700">
              <Star className="w-3 h-3 fill-current" /> MOST POPULAR
            </div>
          )}
          
          <h3 className={`text-xl font-medium mb-2 ${plan.popular ? 'text-teal-50' : 'text-slate-800'}`}>{plan.name}</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className={`text-4xl font-serif font-medium ${plan.popular ? 'text-white' : 'text-slate-800'}`}>{plan.displayPrice}</span>
            <span className={`text-sm ${plan.popular ? 'text-teal-200' : 'text-slate-500'}`}>{plan.period}</span>
          </div>
          <p className={`text-sm mb-8 ${plan.popular ? 'text-teal-100' : 'text-slate-600'}`}>{plan.desc}</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Lộ trình thiền cá nhân hóa', 'Truy cập AI Coach Premium', 'Âm thanh giấc ngủ không giới hạn'].map((feat, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm font-medium ${plan.popular ? 'text-teal-50' : 'text-slate-700'}`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-teal-300' : 'text-teal-500'}`} /> {feat}
              </li>
            ))}
          </ul>

          <button 
            disabled={loading !== null}
            onClick={() => handlePayment(plan)}
            className={`w-full py-4 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.btn}`}
          >
            {loading === plan.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              `Choose ${plan.name}`
            )}
          </button>
        </div>
      ))}

      {/* SePay Payment Modal */}
      <AnimatePresence>
        {paymentData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentData(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setPaymentData(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-4">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">Cổng thanh toán SePay</span>
                <h2 className="text-2xl font-serif font-bold text-slate-800 mt-4 mb-1">Confirm Payment</h2>
                <p className="text-sm text-slate-500">Quét mã QR bằng ứng dụng ngân hàng để thanh toán.</p>
              </div>

              <div className="bg-slate-50 p-8 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6">
                    <img src={paymentData.qrDataURL} alt="SePay QR Code" className="w-64 h-64 object-contain" />
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Số tiền</p>
                        <p className="text-lg font-bold text-indigo-600">{paymentData.amount.toLocaleString()} ₫</p>
                      </div>
                      <button onClick={() => copyToClipboard(paymentData.amount.toString(), 'amount')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        {copied === 'amount' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nội dung</p>
                        <p className="font-bold text-slate-700">{paymentData.content}</p>
                      </div>
                      <button onClick={() => copyToClipboard(paymentData.content, 'content')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                         {copied === 'content' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
              </div>

              <div className="p-6 text-center">
                <p className="text-[10px] text-slate-400 font-medium">Hệ thống sẽ tự động nâng cấp Premium sau khi giao dịch thành công.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
