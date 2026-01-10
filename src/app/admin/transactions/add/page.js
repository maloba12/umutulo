"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Toast from "@/components/Toast";

export default function AddContribution() {
  const { userData } = useAuth();
  const router = useRouter();
  const [type, setType] = useState("Tithe");
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const contributionTypes = ["Tithe", "Offering", "Partnership"];

  useEffect(() => {
    if (!userData?.churchId) return;

    const fetchMembers = async () => {
      try {
        const q = query(
          collection(db, "members"),
          where("churchId", "==", userData.churchId)
        );
        const querySnapshot = await getDocs(q);
        const memberList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(memberList);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!memberId && type !== "Offering") {
      setError("Please select a member for this transaction.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "transactions"), {
        churchId: userData.churchId,
        type,
        memberId: type === "Offering" ? "GUEST" : memberId,
        amount: parseFloat(amount),
        date,
        notes,
        createdAt: serverTimestamp(),
        recordedBy: auth.currentUser.uid
      });
      setShowToast(true);
      setTimeout(() => {
        router.push("/admin/transactions");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <button 
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Add Contribution</h2>
        <p className="text-slate-500 text-sm">Record a new giving transaction</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Type Selection */}
        <div className="grid grid-cols-3 gap-2">
          {contributionTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                type === t 
                  ? "border-blue-600 bg-blue-50 text-blue-600" 
                  : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Member selection - Hidden for General Offering if preferred */}
        {type !== "Offering" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Member</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">-- Choose Member --</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (ZMW)</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
            rows="3"
            placeholder="Add any additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 mt-4"
        >
          {loading ? "Saving..." : "Save Contribution"}
        </button>
      </form>
      {showToast && <Toast message="Contribution recorded successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
