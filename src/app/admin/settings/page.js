"use client";

import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Toast from "@/components/Toast";

export default function Settings() {
  const { userData } = useAuth();
  const router = useRouter();
  
  // State for form fields
  const [churchName, setChurchName] = useState("");
  const [smsProvider, setSmsProvider] = useState("Africa's Talking");
  const [smsApiKey, setSmsApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load initial data
  useEffect(() => {
    if (userData?.churchName) setChurchName(userData.churchName);
    
    const fetchSettings = async () => {
      if (userData?.churchId) {
        const docRef = doc(db, "churches", userData.churchId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) setChurchName(data.name);
          if (data.smsProvider) setSmsProvider(data.smsProvider);
          if (data.smsApiKey) setSmsApiKey(data.smsApiKey);
        }
      }
    };
    fetchSettings();
  }, [userData]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "churches", userData.churchId);
      await updateDoc(docRef, {
        name: churchName,
        smsProvider,
        smsApiKey
      });
      setShowToast(true);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Settings</h2>
        <p className="text-slate-500 text-xs mt-1">Manage your church and account details</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img src="/umutulo_small_logo_120.png" alt="Umutulo Logo" className="w-24 h-24 rounded-full" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{churchName || "My Church"}</h3>
          <p className="text-sm text-slate-500">{userData?.email}</p>
        </div>

        {/* General Settings */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Church Profile</p>
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Church Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                placeholder="Enter Church Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input
                type="text"
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none"
                value="Lusaka, Zambia"
              />
            </div>
          </div>
        </div>

        {/* SMS Configuration */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">SMS Configuration</p>
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">SMS Provider</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all bg-white"
                value={smsProvider}
                onChange={(e) => setSmsProvider(e.target.value)}
              >
                <option value="Africa's Talking">Africa&apos;s Talking</option>
                <option value="Twilio">Twilio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">API Key</label>
              <input 
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all font-mono"
                placeholder="••••••••••••••••"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? "Saving Changes..." : "Save Settings"}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-200">
        <button 
          onClick={handleLogout}
          type="button"
          className="w-full py-4 text-red-600 font-bold bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
      {showToast && <Toast message="Settings saved successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
