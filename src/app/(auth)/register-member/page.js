"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";

export default function RegisterMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [churchId, setChurchId] = useState("");
  const [phone, setPhone] = useState("");
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChurches = async () => {
      try {
        console.log("Fetching churches...");
        // Removed orderBy temporarily to debug index/permission issues
        const q = query(collection(db, "churches"));
        const snapshot = await getDocs(q);
        console.log("Snapshot size:", snapshot.size);
        
        const churchList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        })).sort((a, b) => a.name.localeCompare(b.name)); // Client-side sort
        
        console.log("Church list:", churchList);
        setChurches(churchList);
      } catch (err) {
        console.error("Error fetching churches (Detailed):", err);
        setError(`Failed to load churches: ${err.message}`);
      }
    };
    fetchChurches();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!churchId) {
      setError("Please select your church.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create member document
      await setDoc(doc(db, "members", user.uid), {
        churchId,
        name,
        phone,
        email,
        partnershipStatus: false,
        createdAt: new Date().toISOString(),
      });

      // Create user document with role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name,
        role: "Member",
        churchId,
      });

      setShowToast(true);
      setTimeout(() => {
        router.push("/member/dashboard");
      }, 2000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid account details.");
      } else {
        setError(`Registration failed: ${err.message}`);
        console.error("Registration invalid:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!churchId) {
      setError("Please select your church first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "members", user.uid), {
        churchId,
        name: user.displayName || name,
        phone: phone || "",
        email: user.email,
        partnershipStatus: false,
        createdAt: new Date().toISOString(),
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || name,
        role: "Member",
        churchId,
      });

      setShowToast(true);
      setTimeout(() => {
        router.push("/member/dashboard");
      }, 2000);
    } catch (err) {
      if (err.code === "auth/popup-blocked") {
        setError("Pop-up was blocked. Please allow pop-ups.");
      } else if (err.code === "auth/popup-closed-by-user") {
        console.log("User closed popup");
        return;
      } else {
        setError("Google registration failed. Please try again.");
        console.error("Google Auth Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <img src="/umutulo_small_logo_120.png" alt="Umutulo Logo" className="w-16 h-16 mx-auto mb-4 rounded-full shadow-lg" />
          <h2 className="text-3xl font-bold text-slate-900">Member Registration</h2>
          <p className="text-slate-500 mt-2">Join your church to track your giving</p>
        </div>

        <form onSubmit={handleRegister} className="card space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Your Church</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              value={churchId}
              onChange={(e) => setChurchId(e.target.value)}
            >
              <option value="">-- Search for your church --</option>
              {churches.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Church"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-medium italic">Or join with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.38z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
      {showToast && <Toast message="Welcome! You have joined successfully." onClose={() => setShowToast(false)} />}
    </div>
  );
}
