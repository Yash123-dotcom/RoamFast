'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    getIdToken: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => {};
        try {
            unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                setUser(firebaseUser);
                setLoading(false);
            }, (error) => {
                console.error('Auth state error:', error);
                setLoading(false);
            });
        } catch (error) {
            console.error('Firebase auth not configured:', error);
            setLoading(false);
        }
        return unsubscribe;
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const getIdToken = async () => {
        if (!user) return null;
        try {
            return await user.getIdToken();
        } catch (error) {
            console.error('Error getting ID token:', error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, getIdToken }}>
            {children}
        </AuthContext.Provider>
    );
}
