"use client";

import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function TransactionsList() {
  const { userData } = useAuth();
  const [filterType, setFilterType] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.churchId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Members for names
        const membersSnap = await getDocs(query(collection(db, "members"), where("churchId", "==", userData.churchId)));
        const memberMap = {};
        membersSnap.forEach(doc => {
          memberMap[doc.id] = doc.data().name;
        });
        setMembers(memberMap);

        // Fetch Transactions
        const q = query(
          collection(db, "transactions"),
          where("churchId", "==", userData.churchId)
        );
        const querySnapshot = await getDocs(q);
        const transList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          name: doc.data().memberId === "GUEST" ? "General Offering" : (memberMap[doc.data().memberId] || "Unknown Member")
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(transList);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const filtered = filterType === "All" 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Transactions</h2>
          <p className="text-slate-500 text-xs mt-1">Full history of contributions</p>
        </div>
        <Link href="/admin/transactions/add" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Tithe", "Offering", "Partnership"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterType === type 
                ? "bg-slate-900 text-white shadow-lg" 
                : "bg-white text-slate-500 border border-slate-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-20 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" />
            </svg>
            No transactions found
          </div>
        ) : (
          filtered.map((t) => (
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
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{t.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      t.type === "Tithe" ? "bg-blue-100 text-blue-700" : 
                      t.type === "Offering" ? "bg-emerald-100 text-emerald-700" : 
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {t.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-slate-900">{t.amount}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
