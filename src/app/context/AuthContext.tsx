"use client";

import { getRedirectResult } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { loginWithGoogle } from "@/api/login/loginWithGoogle";
import { BASE_URL } from "@/constants/Network";

// Define the types for your custom Firestore data.
interface SubscriptionData {
    id?: string;
    status?: string;
    clientSecret?: string;
    current_period_end?: number;
}

interface UserCustomData {
    subscription: SubscriptionData | null;
    role?: 'default' | 'upgraded' | string; // Add other roles as needed
}

// Create a combined type that merges Firebase User (as a plain object) with your custom fields.
export interface CombinedUser extends Partial<User>, Partial<UserCustomData> { }

// Define the context properties.
interface AuthContextProps {
    user: CombinedUser | null;
    token: string;
    loading: boolean;
    getToken: () => string;
}

// Create the AuthContext.
const AuthContext = createContext<AuthContextProps>({
    user: null,
    token: '',
    loading: true,
    getToken: () => '',
});

// Create the AuthProvider.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [userCustomData, setUserCustomData] = useState<UserCustomData | null>(null);

    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        // 🔁 Handle Google Redirect result (first thing on app load)
        getRedirectResult(auth)
            .then(async (result) => {
                if (result?.user) {
                    const idToken = await result.user.getIdToken();
                    await loginWithGoogle(idToken); // optional: call your backend to store session etc.
                    localStorage.removeItem("redirectPath");
                }
            })
            .catch((error) => {
                console.error("Redirect login error:", error);
            });

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setFirebaseUser(currentUser);

            if (currentUser) {
                localStorage.setItem('wasAuthenticated', 'true');
                const idToken = await currentUser.getIdToken();
                setToken(idToken);
                localStorage.setItem('firebaseIdToken', idToken);

                try {
                    const response = await fetch(`${BASE_URL}/api/fetchuser`, {
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserCustomData({
                            subscription: data.subscription || null,
                            role: data.role || 'default',
                        });
                    } else {
                        console.warn('Failed to fetch user data:', response.status);
                        setUserCustomData(null);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserCustomData(null);
                }

                const redirectPath = localStorage.getItem("redirectPath");
                if (redirectPath) {
                    localStorage.removeItem("redirectPath");
                    window.location.href = redirectPath;
                }

            } else {
                localStorage.removeItem('wasAuthenticated');
                setToken('');
                setUserCustomData(null);
            }

            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [auth, db]);


    // Manually build a plain object from firebaseUser.
    const firebaseUserData = firebaseUser
        ? {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            displayName: firebaseUser.displayName,
            isAnonymous: firebaseUser.isAnonymous,
            photoURL: firebaseUser.photoURL,
            providerData: firebaseUser.providerData,
            // Add any other fields you want to merge
        }
        : null;

    // Merge the plain Firebase user data with the custom Firestore data.
    const combinedUser: CombinedUser | null = firebaseUserData
        ? { ...firebaseUserData, ...userCustomData }
        : null;

    const getToken = () => token || localStorage.getItem('firebaseIdToken') || '';

    return (
        <AuthContext.Provider value={{ user: combinedUser, token, loading, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext.
export const useAuth = () => useContext(AuthContext);
