"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Droplets, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

// --- KOMPONEN: EducationCard (Versi Murni Informasi) ---
function EducationCard() {
  const tip = {
    title: "Minyak Goreng Bekas",
    desc: "Jangan buang ke wastafel! Minyak bisa membeku dan menyumbat pipa pemukiman.",
    icon: <Droplets className="text-blue-500" size={40} />,
    color: "bg-blue-50"
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-green-100 p-8 shadow-xl shadow-green-900/5 flex flex-col md:flex-row items-center gap-8 text-left">
      <div className={`w-24 h-24 shrink-0 rounded-3xl ${tip.color} flex items-center justify-center shadow-inner`}>
        {tip.icon}
      </div>
      <div className="flex-grow space-y-2">
        <div className="flex items-center gap-2 text-[#2d8c57] font-bold text-sm uppercase tracking-wider">
          <Sparkles size={16} /> Tips Edukasi Minggu Ini
        </div>
        <h4 className="text-2xl font-bold text-[#1f3f2b]">{tip.title}</h4>
        <p className="text-slate-600 leading-relaxed max-w-2xl">
          {tip.desc} Sediakan wadah khusus untuk minyak jelantah dan serahkan ke bank sampah terdekat untuk didaur ulang menjadi biodiesel.
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col w-full selection:bg-[#2d8c57] selection:text-white">
      
      {/* --- SECTION 1: HERO --- */}
      <div className="min-h-[calc(100vh-60px)] w-full bg-[#e5f5e7] flex items-center overflow-hidden relative text-center lg:text-left">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-20 w-full relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Teks Kiri */}
            <div className="order-2 lg:order-1 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <p className="text-xs font-bold tracking-[0.2em] text-[#2d8c57] mb-4 uppercase">
                  Layanan Masyarakat Terpadu
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] text-[#1f3f2b]">
                  PELAPORAN <br />
                  MASALAH <br />
                  <span className="text-[#2d8c57]">LINGKUNGAN</span>
                </h1>
              </motion.div>

              <p className="text-base sm:text-lg text-[#325741] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Temukan sampah menumpuk, jalan rusak, atau saluran tersumbat? 
                Laporkan sekarang agar lingkungan kita tetap bersih, aman, dan nyaman.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/laporan" className="inline-flex items-center justify-center rounded-full bg-[#1f6f3f] text-white text-base font-semibold px-8 py-3.5 shadow-lg hover:bg-[#185632] hover:-translate-y-1 transition-all duration-300">
                  Laporkan Masalah
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border-2 border-[#1f6f3f] text-[#1f6f3f] bg-transparent text-base font-semibold px-8 py-3.5 hover:bg-[#1f6f3f] hover:text-white transition-all duration-300">
                  Lihat Riwayat
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-[#325741]">
                  <div><p className="text-2xl font-bold">24/7</p><p className="text-xs text-[#567a60]">Layanan</p></div>
                  <div className="w-px h-8 bg-[#c8e4cc]"></div>
                  <div><p className="text-2xl font-bold">100%</p><p className="text-xs text-[#567a60]">Transparan</p></div>
              </div>
            </div>

            {/* Gambar Kanan */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] -z-10 opacity-20 pointer-events-none text-[#1f6f3f]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform -rotate-12">
                      <path d="M17,8C8,10,5.9,16.17,3.82,21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19,20,22,3,22,3c-1 2-8 2.25-13 3.25S2,11.5,2,13.5s1.75 3.75 1.75 3.75C7,8,17,8,17,8z"/>
                  </svg>
              </div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 z-10"
              >
                <Image src="/recycle.png" alt="Ilustrasi" fill className="object-contain drop-shadow-2xl" priority />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ALUR PENGADUAN --- */}
      <div className="w-full bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-[#1f3f2b] mb-4">Bagaimana Cara Melapor?</h2>
            <p className="text-[#567a60] mb-12 max-w-2xl mx-auto">Ikuti 3 langkah mudah ini untuk berkontribusi menjaga lingkungan sekitar kita tetap nyaman.</p>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-8 rounded-3xl bg-[#f8fcf9] border border-green-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">📝</div>
                    <h3 className="text-xl font-bold text-[#1f3f2b] mb-3">1. Tulis Laporan</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Isi formulir pengaduan dengan jelas. Sertakan lokasi dan kategori masalah.</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#f8fcf9] border border-green-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">📸</div>
                    <h3 className="text-xl font-bold text-[#1f3f2b] mb-3">2. Upload Foto</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Lampirkan foto bukti kejadian agar petugas bisa memverifikasi dengan cepat.</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#f8fcf9] border border-green-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">✅</div>
                    <h3 className="text-xl font-bold text-[#1f3f2b] mb-3">3. Pantau Status</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Cek berkala riwayat laporan Anda untuk melihat progres penanganan petugas.</p>
                </div>
            </div>
        </div>
      </div>

      {/* --- SECTION 3: EDUKASI & ESTIMASI (FITUR INFORMASI) --- */}
      <div className="w-full bg-[#f8fcf9] py-20 px-6 border-y border-green-50">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Kiri: Card Edukasi (Hanya Informasi) */}
            <div className="lg:col-span-2 space-y-8">
               <EducationCard />
            </div>

            {/* Kanan: Info Urgency Level */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-green-100 shadow-sm space-y-6">
              <h3 className="font-bold text-[#1f3f2b] flex items-center gap-2">
                <Clock className="text-[#2d8c57]" /> Estimasi Penanganan
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-2xl border border-red-100">
                  <span className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    <AlertCircle size={16}/> Darurat
                  </span>
                  <span className="text-xs font-mono font-bold text-red-400">&lt; 6 Jam</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <span className="flex items-center gap-2 text-yellow-700 font-bold text-sm">
                    <Clock size={16}/> Berat
                  </span>
                  <span className="text-xs font-mono font-bold text-yellow-400">1-2 Hari</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl border border-green-100">
                  <span className="flex items-center gap-2 text-green-700 font-bold text-sm">
                    <CheckCircle2 size={16}/> Sedang
                  </span>
                  <span className="text-xs font-mono font-bold text-green-400">3-5 Hari</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                *Penanganan dihitung sejak laporan diverifikasi oleh petugas lapangan kami.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1f6f3f] text-white py-12 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1f6f3f] font-bold">LP</div>
            <span className="font-bold text-xl tracking-tighter">Lapor Pak!</span>
          </div>
          <p className="text-green-200 text-sm">© 2025 Layanan Pengaduan Masyarakat Terpadu.</p>
          <p className="text-green-400 text-xs mt-2 uppercase tracking-widest font-bold">Dibuat untuk Indonesia yang lebih baik</p>
        </div>
      </footer>

    </div>
  );
}

