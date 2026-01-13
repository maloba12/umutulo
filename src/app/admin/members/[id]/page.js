"use client";

import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function MemberDetails({ params }) {
  const { id } = params;
  const { userData } = useAuth();
  const router = useRouter();
  
  const [member, setMember] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !userData?.churchId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Member Profile
        const memberRef = doc(db, "members", id);
        const memberSnap = await getDoc(memberRef);
        
        if (memberSnap.exists()) {
          setMember({ id: memberSnap.id, ...memberSnap.data() });
          
          // Fetch Giving History
          const q = query(
            collection(db, "transactions"),
            where("churchId", "==", userData.churchId),
            where("memberId", "==", id)
          );
          const querySnapshot = await getDocs(q);
          const transList = querySnapshot.docs.map(doc => ({
             id: doc.id, 
             ...doc.data() 
          })).sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setHistory(transList);
        } else {
          setError("Member not found");
        }
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to load member details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userData]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      // Delete member profile
      await deleteDoc(doc(db, "members", id));
      
      // Delete user login if it exists (Client side check only, proper cleanup should be cloud function)
      // Note: We can only delete the document in 'users' collection, not the Auth user from client SDK
      // The auth user will linger but lose access since 'users' doc is checks for roles.
      const userRef = doc(db, "users", id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await deleteDoc(userRef);
      }

      setShowToast(true);
      setTimeout(() => {
        router.push("/admin/members");
      }, 2000);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete member. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!member) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Members
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          Delete Member
        </button>
      </div>

      {/* Member Profile Card */}
      <div className="card p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-300">
          {member.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{member.name}</h1>
            {member.partnershipStatus && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded-full tracking-wider">Partner</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {member.phone}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {member.email || "No email provided"}
            </span>
          </div>
        </div>
      </div>

      {/* Giving History */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Giving History</h3>
        
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
               No contributions recorded yet.
            </div>
          ) : (
            history.map((t) => (
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
      {showToast && <Toast message="Member deleted successfully" onClose={() => setShowToast(false)} />}
    </div>
  );
}
