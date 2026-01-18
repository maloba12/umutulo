"use client";

import Link from "next/link";
import { collection, query, where, getDocs, orderBy, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { db, firebaseConfig } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { parseCSV, parseExcel, generateMemberId, generatePin } from "@/lib/utils";
import Toast from "@/components/Toast";

export default function MembersManagement() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const fileInputRef = useRef(null);

  const fetchMembers = async () => {
    if (!userData?.churchId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "members"),
        where("churchId", "==", userData.churchId)
      );
      const querySnapshot = await getDocs(q);
      const memberList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.name.localeCompare(b.name));
      setMembers(memberList);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [userData]);

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    
    try {
      let parsedData = [];
      
      if (fileType === 'csv') {
        const text = await file.text();
        parsedData = parseCSV(text);
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        parsedData = await parseExcel(file);
      } else {
        setToastMsg("❌ Unsupported file type. Please upload a CSV or Excel file.");
        setShowToast(true);
        return;
      }
      
      if (parsedData.length === 0) {
        setToastMsg("⚠️ No valid member data found. Please ensure your file has 'name' and 'phone' columns.");
        setShowToast(true);
        return;
      }

      if (!confirm(`Are you sure you want to bulk upload ${parsedData.length} members?`)) {
        return;
      }

      setBulkLoading(true);
      setUploadProgress({ current: 0, total: parsedData.length });

      let successCount = 0;
      let failCount = 0;
      let errors = [];

      for (const row of parsedData) {
        let secondaryApp;
        try {
          // Clean data
          const name = row.name?.trim();
          const phone = row.phone?.trim()?.replace(/\s+/g, '');
          const email = row.email?.trim()?.toLowerCase();

          if (!name || !phone) {
            throw new Error("Missing name or phone number");
          }

          const mId = generateMemberId();
          const pin = generatePin();
          const authEmail = email || `${mId.toLowerCase()}@umutulo.temp`;
          
          // Initialize secondary app for this specific member creation to avoid session collision
          const secondaryAppName = `bulk-${mId}`;
          secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
          const secondaryAuth = getAuth(secondaryApp);

          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, authEmail, pin);
          const memberUid = userCredential.user.uid;
          await signOut(secondaryAuth);

          // Save Auth mapping
          await setDoc(doc(db, "users", memberUid), {
            uid: memberUid,
            email: authEmail,
            name: name,
            role: "Member",
            churchId: userData.churchId,
            memberId: mId,
            createdAt: serverTimestamp(),
          });

          // Save Member Directory entry
          await setDoc(doc(db, "members", mId), {
            memberId: mId,
            uid: memberUid,
            churchId: userData.churchId,
            name: name,
            phone: phone,
            email: email || null,
            createdAt: serverTimestamp(),
          });

          successCount++;
        } catch (err) {
          console.error("Bulk upload error for row:", row, err);
          let errMsg = err.message;
          if (err.code === 'auth/email-already-in-use') errMsg = "Email already in use";
          else if (err.code === 'auth/invalid-email') errMsg = "Invalid email format";
          
          failCount++;
          errors.push(`${row.name || 'Unknown'}: ${errMsg}`);
        } finally {
          if (secondaryApp) await deleteApp(secondaryApp);
          setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
        }
      }

      setBulkLoading(false);
      if (failCount === 0) {
        setToastMsg(`✅ Successfully uploaded ${successCount} members.`);
      } else {
        setToastMsg(`⚠️ Uploaded ${successCount}, failed ${failCount}. Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
      }
      setShowToast(true);
      fetchMembers();
    } catch (err) {
      console.error("Bulk upload processing error:", err);
      setToastMsg("❌ Failed to process the file. Please check the format and try again.");
      setShowToast(true);
    } finally {
      e.target.value = null; // Reset input
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Members</h2>
          <p className="text-slate-500 text-xs mt-1">Manage church members and logins</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            accept=".csv, .xlsx, .xls" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={bulkLoading}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Bulk Upload
          </button>
          <Link href="/admin/members/add" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>

      {bulkLoading && (
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Bulk Processing Members...</span>
            <span className="text-xs font-bold text-blue-700">{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-blue-500 mt-2 italic text-center">Please do not close this window until finished.</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search members..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:border-blue-500 transition-all font-medium text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-slate-500 font-medium">No members found</p>
             <p className="text-xs text-slate-400 mt-1">Try adding a new member or check your search</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
          <div key={member.id} className="card flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{member.name}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">{member.phone}</p>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">ID: {member.memberId || 'Legacy'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.partnershipStatus && (
                <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" title="Partner"></span>
              )}
              <Link 
                href={`/admin/members/${member.id}`}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))
        )}
      </div>
      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
    </div>
  );
}

