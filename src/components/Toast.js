"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for transition
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
      type === "success" 
        ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
        : "bg-red-50 border-red-100 text-red-800"
    }`}>
      {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <p className="text-sm font-bold">{message}</p>
      <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors">
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
}
