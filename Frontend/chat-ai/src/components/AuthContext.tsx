"use client";
import { createContext, useContext, useEffect, useState } from "react";
import config from "../includes/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const res = await fetch(`${config.BACKENDSITEURL}/auth/me`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.response_code) {
                    setMember(data.response_data);
                } else {
                    setMember(null);
                }
            } catch {
                setMember(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, []);
    return (
        <AuthContext.Provider value={{ member, loading, isLoggedIn: !!member }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);