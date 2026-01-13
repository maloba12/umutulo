"use client";

import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function MembersManagement() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.churchId) return;

    const fetchMembers = async () => {
      setLoading(true);
      try {
        console.log("Fetching members for Church ID:", userData.churchId);
        const q = query(
          collection(db, "members"),
          where("churchId", "==", userData.churchId)
        );
        const querySnapshot = await getDocs(q);
        console.log("Members found:", querySnapshot.size);
        
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

    fetchMembers();
  }, [userData]);

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
        <Link href="/admin/members/add" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

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
                <p className="text-xs text-slate-500">{member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.partner && (
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
    </div>
  );
}
