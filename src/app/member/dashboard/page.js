"use client";

import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function MemberDashboard() {
  const { user, userData } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState([
    { label: "My Tithe", amount: "K0", color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "My Offering", amount: "K0", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "My Partnership", amount: "K0", color: "text-purple-600", bgColor: "bg-purple-50" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !userData?.churchId) return;

    const fetchMemberData = async () => {
      setLoading(true);
      try {
        // Query transactions for this member using their Member ID
        if (!userData?.memberId) {
          console.error("Member ID not found in user data");
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "transactions"),
          where("churchId", "==", userData.churchId),
          where("memberId", "==", userData.memberId)
        );
        const querySnapshot = await getDocs(q);
        
        let tithe = 0;
        let offering = 0;
        let partnership = 0;
        const transList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "Tithe") tithe += data.amount;
          else if (data.type === "Offering") offering += data.amount;
          else if (data.type === "Partnership") partnership += data.amount;
          
          transList.push({ id: doc.id, ...data });
        });

        // Client-side sort
        transList.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(transList);
        setStats(prev => [
          { ...prev[0], amount: `K${tithe.toLocaleString()}` },
          { ...prev[1], amount: `K${offering.toLocaleString()}` },
          { ...prev[2], amount: `K${partnership.toLocaleString()}` },
        ]);
      } catch (err) {
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user, userData]);

  return (
    <div className="space-y-8">
      {/* Mini Stats Carousel/Grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-4 text-center ${stat.bgColor}`}>
            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500 mb-1">{stat.label.split(' ')[1]}</p>
            <p className={`text-sm font-extrabold ${stat.color}`}>{stat.amount}</p>
          </div>
        ))}
      </div>

      {/* History section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-800">Recent History</h3>
          <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">Loading history...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm italic">No giving records found yet.</div>
          ) : (
            transactions.map((item) => (
              <div key={item.id} className="card py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === "Tithe" ? "bg-blue-100 text-blue-600" : 
                    item.type === "Offering" ? "bg-emerald-100 text-emerald-600" : 
                    "bg-purple-100 text-purple-600"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.type}</p>
                    <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-900">K{item.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Success</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statement Download CTA */}
      <div className="card bg-slate-900 text-white border-none py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold">Annual Statement</h4>
            <p className="text-xs text-slate-400 mt-1">Download your giving report for tax or personal records.</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
            Download Statement (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
