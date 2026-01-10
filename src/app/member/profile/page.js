"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function MemberProfile() {
  const { userData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">My Profile</h2>
        <p className="text-slate-500 text-xs mt-1">Manage your account and credentials</p>
      </div>

      <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 font-bold text-2xl">
          {userData?.name ? userData.name.split(' ').map(n => n[0]).join('') : "M"}
        </div>
        <h3 className="text-xl font-bold text-slate-900">{userData?.name || "Member Name"}</h3>
        <p className="text-sm text-slate-500">{userData?.email}</p>
      </div>

      <div className="card divide-y divide-slate-100 p-0 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Phone Number</span>
          <span className="text-sm text-slate-500">{userData?.phone || "Not set"}</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Church</span>
          <span className="text-sm text-slate-500">{userData?.churchName || "Not set"}</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Account Type</span>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">Member</span>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full py-4 text-slate-600 font-bold bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}
