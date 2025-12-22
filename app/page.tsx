import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      
      {/* --- SECTION 1: HERO (Bagian Atas) --- */}
      <div className="min-h-[calc(100vh-60px)] w-full bg-[#e5f5e7] flex items-center overflow-hidden relative">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-20 w-full relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Teks Kiri */}
            <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-[#2d8c57] mb-4 uppercase">
                  Layanan Masyarakat Terpadu
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] text-[#1f3f2b]">
                  PELAPORAN <br />
                  MASALAH <br />
                  <span className="text-[#2d8c57]">LINGKUNGAN</span>
                </h1>
              </div>
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

            {/* Gambar Kanan + Watermark Daun */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] -z-10 opacity-20 pointer-events-none text-[#1f6f3f]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform -rotate-12">
                      <path d="M17,8C8,10,5.9,16.17,3.82,21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19,20,22,3,22,3c-1 2-8 2.25-13 3.25S2,11.5,2,13.5s1.75 3.75 1.75 3.75C7,8,17,8,17,8z"/>
                  </svg>
              </div>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 z-10">
                <Image src="/recycle.png" alt="Ilustrasi" fill className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" priority />
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#2d8c57] animate-bounce">
        </div>
      </div>

      {/* --- SECTION 2: ALUR PENGADUAN (Bagian Baru) --- */}
      <div className="w-full bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-[#1f3f2b] mb-4">Bagaimana Cara Melapor?</h2>
            <p className="text-[#567a60] mb-12 max-w-2xl mx-auto">Ikuti 3 langkah mudah ini untuk berkontribusi menjaga lingkungan sekitar kita tetap nyaman.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="p-8 rounded-3xl bg-[#f8fcf9] border border-green-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">📝</div>
                    <h3 className="text-xl font-bold text-[#1f3f2b] mb-3">1. Tulis Laporan</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Isi formulir pengaduan dengan jelas. Sertakan lokasi dan kategori masalah.</p>
                </div>

                {/* Step 2 */}
                <div className="p-8 rounded-3xl bg-[#f8fcf9] border border-green-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">📸</div>
                    <h3 className="text-xl font-bold text-[#1f3f2b] mb-3">2. Upload Foto</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Lampirkan foto bukti kejadian agar petugas bisa memverifikasi dengan cepat.</p>
                </div>

                {/* Step 3 */}
                <div className="p-8 rounded-3xl bg-[#f8fcf9] border border-green-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform">✅</div>
                    <h3 className="text-xl font-bold text-[#1f3f2b] mb-3">3. Tindak Lanjut</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Laporan akan diverifikasi dan diteruskan ke petugas terkait. Pantau statusnya di dashboard.</p>
                </div>
            </div>
        </div>
      </div>

      {/* --- FOOTER SEDERHANA --- */}
      <footer className="bg-[#1f6f3f] text-white py-8 text-center text-sm">
        <p>&copy; 2025 Lapor Pak! - Layanan Pengaduan Masyarakat.</p>
        <p className="text-green-200 mt-1">Dibuat untuk Indonesia yang lebih baik.</p>
      </footer>

    </div>
  );
}