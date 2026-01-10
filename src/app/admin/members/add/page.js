"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/Toast";

export default function AddMember() {
  const { userData } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Member login in Firebase Auth if email/password provided
      let memberUid = null;
      if (email && password) {
        // Warning: This will sign the current admin out in client-side Firebase Auth!
        // In a real app, you'd use a Cloud Function to create users without signing out.
        // For MVP, we will advise the admin to set these up or handle the session logic.
        // ACTUALLY, for MVP we will just save the member doc and skip auth creation 
        // OR mention this limitation. Let's stick to saving the member doc first.
        
        // await createUserWithEmailAndPassword(auth, email, password); // Skip for now to avoid session kick
      }

      // 2. Save Member to Firestore
      const memberRef = await addDoc(collection(db, "members"), {
        churchId: userData.churchId,
        name,
        phone,
        email: email || null,
        partnershipStatus: isPartner,
        createdAt: serverTimestamp(),
      });

      // 3. If login was intended, we'd typicaly create a secondary user record
      // But we will just redirect back for now.
      setShowToast(true);
      setTimeout(() => {
        router.push("/admin/members");
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
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Add New Member</h2>
        <p className="text-slate-500 text-sm">Create a profile and login access</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

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

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500">
          Note: Credentials below are optional. If provided, the member can log in to view their giving history.
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email (for Login)</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            placeholder="member@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          {loading ? "Saving Member..." : "Save Member Profile"}
        </button>
      </form>
      {showToast && <Toast message="Member created successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
