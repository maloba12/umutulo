"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, doc, setDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { initializeApp, deleteApp, getApp, getApps } from "firebase/app";
import { db, auth, firebaseConfig } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { generateMemberId, generatePin } from "@/lib/utils";
import Toast from "@/components/Toast";

export default function AddMember() {
  const { userData } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [pin, setPin] = useState("");
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Generate credentials on load
  useEffect(() => {
    setMemberId(generateMemberId());
    setPin(generatePin());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userData?.churchId) {
      setError("Church ID missing. Please refresh and try again.");
      setLoading(false);
      return;
    }

    let secondaryApp;
    try {
      // 1. Generate a temporary email if none provided (required for Firebase Auth)
      const authEmail = email || `${memberId.toLowerCase()}@umutulo.temp`;
      const authPassword = pin;

      // 2. Create account using Secondary App to avoid signing out current Admin
      const secondaryAppName = `secondary-${memberId}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, authEmail, authPassword);
      const memberUid = userCredential.user.uid;
      
      // Immediately sign out from secondary app
      await signOut(secondaryAuth);

      // 3. Save to Users collection (Auth mapping)
      await setDoc(doc(db, "users", memberUid), {
        uid: memberUid,
        email: authEmail,
        name: name,
        role: "Member",
        churchId: userData.churchId,
        memberId: memberId,
        createdAt: serverTimestamp(),
      });

      // 4. Save to Members collection (Directory)
      await setDoc(doc(db, "members", memberId), {
        memberId,
        uid: memberUid,
        churchId: userData.churchId,
        name,
        phone,
        email: email || null,
        partnershipStatus: isPartner,
        createdAt: serverTimestamp(),
      });

      setShowToast(true);
      setTimeout(() => {
        router.push("/admin/members");
      }, 2000);
    } catch (err) {
      console.error("Member Creation Error:", err);
      setError(err.message);
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (e) {
          console.error("Error deleting secondary app:", e);
        }
      }
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
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Add New Member</h2>
        <p className="text-slate-500 text-sm">Create a profile and system-generated access</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              placeholder="e.g. Martha Phiri"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              placeholder="+260..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Optional)</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            placeholder="member@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Access Credentials</h4>
            <span className="px-2 py-1 bg-blue-200 text-blue-700 text-[10px] font-bold rounded uppercase">System Generated</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Member ID</label>
              <div className="text-xl font-mono font-bold text-blue-900 bg-white p-3 rounded-xl border border-blue-200 text-center">
                {memberId}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Login PIN</label>
              <div className="text-xl font-mono font-bold text-blue-900 bg-white p-3 rounded-xl border border-blue-200 text-center">
                {pin}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-blue-500 italic">Please share these credentials with the member. They will need them to log in.</p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
          <input
            type="checkbox"
            id="isPartner"
            className="w-5 h-5 text-purple-600 rounded-md border-purple-200 focus:ring-purple-500"
            checked={isPartner}
            onChange={(e) => setIsPartner(e.target.checked)}
          />
          <label htmlFor="isPartner" className="text-sm font-bold text-purple-900">Mark as Partnership Member</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 mt-4"
        >
          {loading ? "Generating Account..." : "Confirm & Save Member"}
        </button>
      </form>
      {showToast && <Toast message="Member created successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}

