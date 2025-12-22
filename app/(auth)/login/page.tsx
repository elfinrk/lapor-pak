"use client";

import { loginAction } from "@/actions/auth.actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#1f6f3f] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/10 hover:bg-[#185632] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
    >
      {pending ? "Memproses..." : "Masuk Sekarang"}
    </button>
  );
}

export default function LoginPage() {
  const [message, setMessage] = useState("");

  async function clientAction(formData: FormData) {
    const res = await loginAction(formData);
    if (!res?.success && res?.message) {
      setMessage(res.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f8fcf9] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-green-50 p-8 md:p-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#1f6f3f] font-bold text-xl mb-4 shadow-sm">
            LP
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Selamat Datang Kembali</h1>
          <p className="text-slate-500 text-sm mt-2">Masuk untuk mengelola laporan Anda.</p>
        </div>

        <form action={clientAction} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="contoh@email.com"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-medium transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-medium transition-all"
            />
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-bold text-center border border-red-100">
              ⚠️ {message}
            </div>
          )}

          <SubmitButton />
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#1f6f3f] font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}