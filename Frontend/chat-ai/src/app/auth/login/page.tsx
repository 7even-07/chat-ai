"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiPost } from "@/services/authenticationAPI";
import { useRouter } from "next/navigation";
import { openLoadingModal } from "@/app/lib/alert";

export default function Login() {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [form, setForm] = useState({email_addr: '', password: ''});

    useEffect(() => {
        setHasMounted(true);
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        openLoadingModal();

        try {
            const result = await apiPost("/auth/login", form);
            
            if (result?.response_code) {
                router.push("/");
            }
        } catch (err: any) {
            alert(err.message || "Login failed");
        }
    }

      return (
        <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium">Email</label>
            <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={form.email_addr}
                onChange={(e)=>setForm({...form, email_addr:e.target.value})}
                required
            />
            </div>
            <div>
            <label className="block text-sm font-medium">Password</label>
            <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={form.password}
                onChange={(e)=>setForm({...form, password:e.target.value})}
                required
            />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
        </div>
    );
}