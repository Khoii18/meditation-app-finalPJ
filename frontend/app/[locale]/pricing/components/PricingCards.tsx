"use client";

import { useState } from "react";
import { CheckCircle2, Star, Loader2, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { AuthGateway } from "@/components/auth/AuthGateway";
import { API_URL } from "@/config";

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [showAuthGateway, setShowAuthGateway] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'vi';

  const plans = [
    { id: "monthly", name: "Monthly", price: 2000, displayPrice: "2,000₫", period: "/month", desc: "Perfect for those starting their journey.", popular: false, color: "bg-surface", border: "border-border", text: "text-foreground", btn: "bg-background text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 border border-border" },
    { id: "annual", name: "Annual", price: 5000, displayPrice: "5,000₫", period: "/year", desc: "Best value. For long-term commitment.", popular: true, color: "bg-teal-600", border: "border-transparent", text: "text-white", btn: "bg-white text-teal-700 shadow-md hover:bg-slate-50" },
    { id: "lifetime", name: "Lifetime", price: 10000, displayPrice: "10,000₫", period: " once", desc: "Lifetime access to all premium features.", popular: false, color: "bg-surface", border: "border-border", text: "text-foreground", btn: "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20" },
  ];

   const handlePayment = async (plan: any) => {
     if (!isLoggedIn) {
       setShowAuthGateway(true);
       return;
     }
     try {
       setLoading(plan.id);
       const token = localStorage.getItem("token");
       
       const response = await fetch(`${API_URL}/api/payment/create-qr`, {
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

  const handleSimulatePayment = async () => {
    if (!paymentData?.content) return;
    try {
      setSimulating(true);
      const res = await fetch(`${API_URL}/api/payment/simulate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionCode: paymentData.content })
      });
      if (res.ok) {
        alert("Payment successful! You have been upgraded to Premium.");
        setPaymentData(null);
        window.location.href = "/"; // Redirect or refresh to apply Premium
      } else {
        alert("An error occurred during payment simulation.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
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
          
          <h3 className={`text-xl font-medium mb-2 ${plan.popular ? 'text-teal-50' : 'text-foreground'}`}>{plan.name}</h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className={`text-4xl font-serif font-medium ${plan.popular ? 'text-white' : 'text-foreground'}`}>{plan.displayPrice}</span>
            <span className={`text-sm ${plan.popular ? 'text-teal-200' : 'text-muted'}`}>{plan.period}</span>
          </div>
          <p className={`text-sm mb-8 ${plan.popular ? 'text-teal-100' : 'text-muted'}`}>{plan.desc}</p>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Personalized meditation paths', 'Premium AI Coach access', 'Unlimited sleep sounds'].map((feat, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm font-medium ${plan.popular ? 'text-teal-50' : 'text-foreground opacity-90'}`}>
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
              className="relative w-full max-w-lg bg-surface rounded-[2.5rem] shadow-2xl border border-border overflow-hidden"
            >
              <button 
                onClick={() => setPaymentData(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-background text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-4">
                <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-teal-500/20">SePay Payment Gateway</span>
                <h2 className="text-2xl font-serif font-bold text-foreground mt-4 mb-1">Confirm Payment</h2>
                <p className="text-sm text-muted">Scan the QR code with your banking app to pay.</p>
              </div>

              <div className="bg-background/50 p-8 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6">
                    <img src={paymentData.qrDataURL} alt="SePay QR Code" className="w-64 h-64 object-contain" />
                  </div>

                   <div className="w-full space-y-3">
                     <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Amount</p>
                        <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{paymentData.amount.toLocaleString()} ₫</p>
                      </div>
                      <button onClick={() => copyToClipboard(paymentData.amount.toString(), 'amount')} className="p-2 text-muted hover:text-teal-600 transition-colors">
                        {copied === 'amount' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted tracking-wider">Reference</p>
                        <p className="font-bold text-foreground">{paymentData.content}</p>
                      </div>
                      <button onClick={() => copyToClipboard(paymentData.content, 'content')} className="p-2 text-muted hover:text-teal-600 transition-colors">
                         {copied === 'content' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
              </div>

              <div className="p-6 flex flex-col items-center gap-4">
                <button
                  onClick={handleSimulatePayment}
                  disabled={simulating}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {simulating ? "Processing..." : "I have completed the payment (Simulate)"}
                </button>
                <p className="text-[10px] text-slate-400 font-medium text-center">
                  Your account will be upgraded to Premium automatically after a successful transaction.
                </p>
              </div>
            </motion.div>
          </div>
        )}
       </AnimatePresence>

      <AuthGateway 
        isOpen={showAuthGateway} 
        onClose={() => setShowAuthGateway(false)} 
      />
    </div>
  );
}
