"use client";

import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function MyGiving() {
  const { user, userData } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !userData?.churchId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "transactions"),
          where("memberId", "==", user.uid), // Only show transactions for logged-in member
          where("churchId", "==", userData.churchId)
        );
        const querySnapshot = await getDocs(q);
        const transList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(transList);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, userData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">My Giving</h2>
        <p className="text-slate-500 text-xs mt-1">History of your contributions</p>
      </div>

      <div className="space-y-3">
        {loading ? (
           <div className="text-center py-10 text-slate-400">Loading history...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-slate-500 font-medium">No contributions found yet</p>
             <p className="text-xs text-slate-400 mt-1">Your giving history will appear here</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  t.type === "Tithe" ? "bg-blue-50 text-blue-600" : 
                  t.type === "Offering" ? "bg-emerald-50 text-emerald-600" : 
                  "bg-purple-50 text-purple-600"
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{t.type}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(t.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-slate-900">K{t.amount}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
