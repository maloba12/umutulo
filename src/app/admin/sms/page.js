"use client";

import { useState } from "react";

export default function SMSReminders() {
  const [activeTab, setActiveTab] = useState("Tithe");


  const tabs = [
    { id: "Tithe", label: "Monthly Tithe", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: "Partnership", label: "Partnership", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { id: "Thanks", label: "Thank You", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">SMS Reminders</h2>
        <p className="text-slate-500 text-xs mt-1">Configure communications and API settings</p>
      </div>

      <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100 mb-4">
        To configure your SMS Provider and API Key, please go to <a href="/admin/settings" className="font-bold underline">Settings</a>.
      </div>


      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
              activeTab === tab.id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Automatic Reminders</h3>
            <p className="text-xs text-slate-500">Enable system-triggered messages</p>
          </div>
          <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-all">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message Preview</label>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed relative">
            <div className="absolute -left-2 top-4 w-4 h-4 bg-slate-50 border-l border-t border-slate-100 rotate-45 transform -scale-x-100"></div>
            {activeTab === "Tithe" && "Greetings from [Church Name]. This is a friendly reminder for your monthly tithe. Your faithfulness is appreciated! God bless."}
            {activeTab === "Partnership" && "Dear Partner, thank you for your commitment. This is a reminder of your partnership pledge for this month. Together we achieve more."}
            {activeTab === "Thanks" && "Thank you for your generous giving to [Church Name]. Your contribution of [Amount] has been received successfully. God bless you!"}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="btn-primary w-full">Send Now to All Members</button>
          <button className="btn-outline w-full">Edit Template</button>
        </div>
      </div>

    </div>
  );
}
