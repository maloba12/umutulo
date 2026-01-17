"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = () => {};
    let unsubscribeChurch = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Listen to user document
        unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
          if (userDoc.exists()) {
            const userDocData = userDoc.data();
            
            // If churchId exists, listen to church document
            if (userDocData.churchId) {
              unsubscribeChurch(); // Unsubscribe previous church listener if any
              unsubscribeChurch = onSnapshot(doc(db, "churches", userDocData.churchId), (churchDoc) => {
                if (churchDoc.exists()) {
                  const churchData = churchDoc.data();
                  setUserData({ ...userDocData, ...churchData, churchName: churchData.name });
                } else {
                  setUserData(userDocData);
                }
              });
            } else {
              setUserData(userDocData);
            }
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (err) => {
          console.error("User doc listener error:", err);
          setLoading(false);
        });
      } else {
        setUser(null);
        setUserData(null);
        unsubscribeUser();
        unsubscribeChurch();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser();
      unsubscribeChurch();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
