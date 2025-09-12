"use client";
import { FormEvent, useState, useEffect } from "react";
import { apiPost, verifyOTP } from "@/services/authenticationAPI";
import { useRouter } from "next/navigation";
import { openLoadingModal } from "@/app/lib/alert";

export default function Register() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [stage, setStage] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    username: "",
    email_addr: "",
    password: "",
    phone_number: "",
  });

  useEffect(() => {
    setHasMounted(true);
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    openLoadingModal();

    try {
      const result = await apiPost("/auth/register", form);

      if (result?.response_code) {
        setStage("verify");
      }
    } catch (err: any) {
      alert(err.message || "Failed to register");
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    openLoadingModal();

    try {
      const result = await verifyOTP("/auth/verify-otp", {
        email_addr: form.email_addr,
        otp,
      });

      if (result?.response_code) {
        await apiPost("/auth/login", {
          email_addr: form.email_addr,
          password: form.password,
        });

        router.push("/");
      }
    } catch (err: any) {
      alert(err.message || "Failed to verify OTP");
    }
  };

  if (!hasMounted) return null;
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      {stage == "register" ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="blok text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={form.email_addr}
                onChange={(e) =>
                  setForm({ ...form, email_addr: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Register
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
          <p className="text-sm text-gray-600 mb-2">
            Enter the 6-digit OTP sent to <b>{form.email_addr}</b>.
          </p>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Verify & Continue
            </button>
          </form>
        </>
      )}
    </div>
  );
}
