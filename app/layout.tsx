import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/actions/auth.actions";

export const metadata: Metadata = {
  title: "Lapor Pak",
  description: "Layanan pelaporan masalah lingkungan secara online",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  return (
    <html lang="id">
      {/* Tambahkan pb-24 agar konten tidak tertutup menu bawah di HP */}
      <body className="min-h-screen bg-[#f8fcf9] text-slate-800 font-sans pb-24 md:pb-0">
        
        {/* --- NAVBAR ATAS (DESKTOP & MOBILE HEADER) --- */}
        <header className="bg-[#1f6f3f] border-b border-green-800 sticky top-0 z-50 shadow-lg shadow-green-900/20">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            
            {/* KIRI: LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1f6f3f] font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                LP
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white leading-none">LAPOR</span>
                <span className="text-sm font-semibold tracking-widest text-green-200 leading-none">PAK!</span>
              </div>
            </Link>

            {/* TENGAH: MENU UTAMA (DESKTOP) */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-green-100">
              <Link 
                href="/laporan" 
                className="px-4 py-2 rounded-full hover:bg-white hover:text-[#1f6f3f] transition-all duration-300"
              >
                Buat Laporan
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-full hover:bg-white hover:text-[#1f6f3f] transition-all duration-300"
              >
                Riwayat
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 rounded-full hover:bg-white hover:text-[#1f6f3f] transition-all duration-300"
              >
                Tentang
              </Link>
              {/* TOMBOL KONTAK BARU */}
              <Link 
                href="/contact" 
                className="px-4 py-2 rounded-full hover:bg-white hover:text-[#1f6f3f] transition-all duration-300"
              >
                Kontak
              </Link>
              
              {isAdmin && (
                 <Link 
                    href="/admin" 
                    className="ml-2 px-5 py-2 bg-white text-[#1f6f3f] rounded-full text-xs font-bold shadow-md hover:bg-green-50 hover:scale-105 transition-all"
                 >
                    Panel Admin
                 </Link>
              )}
            </div>

            {/* KANAN: USER INFO */}
            <div className="flex items-center gap-4 text-sm">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-green-200 font-medium">Halo,</p>
                    <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                  </div>
                  <form action={logoutAction}>
                    <button className="rounded-full border border-green-500/50 bg-green-800/30 px-5 py-2 text-green-100 hover:bg-white hover:text-[#1f6f3f] transition text-xs font-semibold">
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block px-4 py-2 rounded-full font-semibold text-green-100 hover:bg-white/10 hover:text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-white text-[#1f6f3f] px-5 py-2 font-bold text-xs shadow-md hover:bg-green-50 hover:-translate-y-0.5 transition-all"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="w-full">
            {children}
        </main>

        {/* --- MENU BAWAH KHUSUS HP (BOTTOM NAV) --- */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-green-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
          <div className="flex justify-around items-center py-3">
            
            <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#1f6f3f] transition">
              <span className="text-xl">🏠</span>
              <span className="text-[10px] font-medium">Home</span>
            </Link>

            <Link href="/contact" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#1f6f3f] transition">
              <span className="text-xl">📞</span>
              <span className="text-[10px] font-medium">Kontak</span>
            </Link>

            {/* Tombol Tengah Menonjol */}
            <Link href="/laporan" className="-mt-8 bg-[#1f6f3f] text-white p-4 rounded-full shadow-lg border-4 border-[#f8fcf9]">
              <span className="text-2xl font-bold">+</span>
            </Link>

            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#1f6f3f] transition">
              <span className="text-xl">📜</span>
              <span className="text-[10px] font-medium">Riwayat</span>
            </Link>

            {isAdmin ? (
               <Link href="/admin" className="flex flex-col items-center gap-1 text-red-500 hover:text-red-700 transition">
                 <span className="text-xl">⚙️</span>
                 <span className="text-[10px] font-medium">Admin</span>
               </Link>
            ) : (
               <Link href="/about" className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#1f6f3f] transition">
                 <span className="text-xl">ℹ️</span>
                 <span className="text-[10px] font-medium">Info</span>
               </Link>
            )}

          </div>
        </div>

      </body>
    </html>
  );
}