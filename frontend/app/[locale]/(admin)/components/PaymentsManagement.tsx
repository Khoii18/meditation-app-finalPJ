"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, XCircle, Clock, AlertCircle, Check } from "lucide-react";

interface Transaction {
  _id: string;
  userId: { _id: string; name: string; email: string } | null;
  amount: number;
  planId?: string;
  content: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export function PaymentsManagement({ token }: { token: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/payment/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const handleResolve = async (transactionId: string, planId: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/transactions/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId, planId })
      });
      if (res.ok) {
        fetchTransactions();
        alert("Transaction resolved successfully!");
      } else {
        alert("Failed to resolve transaction.");
      }
    } catch (e) {
      console.error(e);
      alert("Error resolving transaction.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-100"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider border border-rose-100"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
    }
  };

  const totalRevenue = transactions.filter(t => t.status === "COMPLETED").reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-teal-100 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
            <CreditCard className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{transactions.length}</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Transactions</p>
        </div>
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{transactions.filter(t => t.status === "COMPLETED").length}</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">Completed Sales</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl p-6 shadow-md text-white">
           <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <span className="font-serif font-bold text-xl">₫</span>
          </div>
          <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-100 mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-teal-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center text-slate-400 font-medium">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="py-24 text-center text-slate-400 font-medium">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-teal-50 bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Plan</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {t.userId ? (
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.userId.name}</p>
                          <p className="text-xs text-slate-400">{t.userId.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Deleted User</span>
                      )}
                      <p className="text-[10px] text-slate-300 font-mono mt-1">Ref: {t.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-teal-600">{t.amount.toLocaleString()}₫</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.planId ? (
                        <span className="text-sm font-semibold text-slate-700 capitalize">{t.planId}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-rose-50 text-rose-600 px-2 py-1 rounded-lg border border-rose-100 font-bold">
                          <AlertCircle className="w-3 h-3" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {t.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                           {["monthly", "annual", "lifetime"].map(plan => (
                             <button
                               key={plan}
                               onClick={() => {
                                 if (confirm(`Resolve transaction as ${plan}?`)) {
                                   handleResolve(t._id, plan);
                                 }
                               }}
                               className="text-[10px] font-bold uppercase tracking-wider bg-white border border-teal-200 text-teal-600 px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors"
                             >
                               Set {plan}
                             </button>
                           ))}
                           <button 
                             onClick={async () => {
                               if (confirm("Reject this transaction?")) {
                                 const res = await fetch("http://localhost:5000/api/payment/transactions/reject", {
                                   method: "POST",
                                   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                                   body: JSON.stringify({ transactionId: t._id })
                                 });
                                 if (res.ok) fetchTransactions();
                               }
                             }}
                             className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl" title="Reject"
                           >
                             <XCircle className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${t.status === 'COMPLETED' ? 'text-emerald-500' : 'text-rose-400'}`}>
                            {t.status === 'COMPLETED' ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {t.status}
                          </span>
                          <button 
                             onClick={async () => {
                               if (confirm("Delete this transaction record forever?")) {
                                 const res = await fetch(`http://localhost:5000/api/payment/transactions/${t._id}`, {
                                   method: "DELETE",
                                   headers: { "Authorization": `Bearer ${token}` }
                                 });
                                 if (res.ok) fetchTransactions();
                               }
                             }}
                             className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                           >
                             <XCircle className="w-4 h-4" />
                           </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
