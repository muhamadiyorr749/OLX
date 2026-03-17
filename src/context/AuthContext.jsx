import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Avval localStorage'dan tekshiramiz (Bypass uchun)
        const savedUser = localStorage.getItem('supabase_user_bypass');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);
        }

        // 2. Supabase sessiyasini tekshiramiz
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else if (!localStorage.getItem('supabase_user_bypass')) {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, metadata = {}) => {
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
    };

    const signIn = async (email, password) => {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    };

    const signOut = async () => {
        localStorage.removeItem('supabase_user_bypass');
        setUser(null);
        return await supabase.auth.signOut();
    };

    const value = {
        signUp,
        signIn,
        signOut,
        user,
        setUser, // Buni qo'shdik
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
