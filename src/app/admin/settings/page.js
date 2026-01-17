"use client";

import { useAuth } from "@/context/AuthContext";
import { auth, db, storage } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Toast from "@/components/Toast";
import { Camera, Upload } from "lucide-react";

export default function Settings() {
  const { userData } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // State for form fields
  const [churchName, setChurchName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Load initial data - only strictly necessary fields
  useEffect(() => {
    if (userData) {
      if (userData.churchName) setChurchName(userData.churchName);
      if (userData.logoUrl) setLogoUrl(userData.logoUrl);
    }
  }, [userData]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!userData?.churchId) {
      alert("Error: Church ID missing from session. Please try logging out and back in.");
      return;
    }

    setUploading(true);
    setUploadStatus("Starting...");
    
    try {
      console.log("Preparing storage reference...");
      setUploadStatus("Connecting to storage...");
      const storageRef = ref(storage, `churches/${userData.churchId}/logo`);
      
      console.log("Beginning byte upload...");
      setUploadStatus("Uploading file...");
      const snapshot = await uploadBytes(storageRef, file);
      
      console.log("Upload successful, fetching URL...");
      setUploadStatus("Finalizing...");
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setLogoUrl(downloadURL);
      setUploadStatus("Done!");
      console.log("New logo URL set:", downloadURL);
      
      // Auto-save to Firestore immediately so AuthContext picks it up
      const docRef = doc(db, "churches", userData.churchId);
      await updateDoc(docRef, { logoUrl: downloadURL });
      
    } catch (error) {
      console.error("CRITICAL UPLOAD ERROR:", error);
      setUploadStatus("Failed");
      alert(`Upload failed: ${error.message}\n\nTechnical details: ${error.code || "No code"}`);
    } finally {
      // Small delay to let user see "Done" status
      setTimeout(() => {
        setUploading(false);
        setUploadStatus("");
      }, 1000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "churches", userData.churchId);
      await updateDoc(docRef, {
        name: churchName,
        logoUrl
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
          <div className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <Camera className="text-white w-8 h-8" />
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-white/90 rounded-full z-20 flex flex-col items-center justify-center p-2 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-2"></div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{uploadStatus}</span>
              </div>
            )}
            <img 
              src={logoUrl || "/umutulo_small_logo_120.png"} 
              alt="Church Logo" 
              className="w-full h-full rounded-full border-4 border-white shadow-xl object-cover" 
            />
            <div className="absolute bottom-1 right-1 p-2 bg-blue-600 rounded-full text-white shadow-lg border-2 border-white z-20">
              <Upload className="w-3 h-3" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
            />
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-xs font-mono bg-slate-50 text-slate-500"
                  value={logoUrl}
                  readOnly
                  placeholder="Automated URL after upload"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors"
                >
                  Change Image
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 ml-1">Supports JPG, PNG up to 2MB</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || uploading}
          className="w-full btn-primary disabled:opacity-50"
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
