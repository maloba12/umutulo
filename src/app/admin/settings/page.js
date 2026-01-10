"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { userData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const sections = [
    { title: "Church Profile", items: [
      { label: "Church Name", value: userData?.churchName || "Not set" },
      { label: "Address", value: "Lusaka, Zambia" },
    ]},
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Settings</h2>
        <p className="text-slate-500 text-xs mt-1">Manage your church and account details</p>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img src="/umutulo_small_logo_120.png" alt="Umutulo Logo" className="w-24 h-24 rounded-full" />
          <button className="absolute -right-2 -bottom-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 border border-slate-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <h3 className="text-xl font-bold text-slate-900">{userData?.churchName || "My Church"}</h3>
        <p className="text-sm text-slate-500">{userData?.email}</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{section.title}</p>
            <div className="card divide-y divide-slate-100 p-0 overflow-hidden">
              {section.items.map((item) => (
                <div key={item.label} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{item.value}</span>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleLogout}
        className="w-full py-4 text-red-600 font-bold bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log Out
      </button>
    </div>
  );
}
