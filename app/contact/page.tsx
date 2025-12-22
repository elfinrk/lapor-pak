"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  // Simulasi pengiriman pesan (karena belum ada backend khusus contact)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset status setelah 3 detik
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f3f2b] mb-4">Hubungi Kami</h1>
          <p className="text-[#567a60] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan, saran, atau kendala teknis? Tim Lapor Pak! siap mendengar Anda.
            Silakan hubungi kami melalui saluran di bawah ini.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          
          {/* --- KOLOM KIRI: Informasi Kontak --- */}
          <div className="space-y-6">
            
            {/* Card Alamat */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-50 flex items-start gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 text-[#1f6f3f]">
                📍
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Kantor Pusat</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  E38<br />
                  Jl. Permata Buah Batu <br />
                  Bandung, Indonesia
                </p>
              </div>
            </div>

            {/* Card Email */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-50 flex items-start gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 text-[#1f6f3f]">
                📧
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Email Resmi</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  <span className="block font-medium text-green-700">elfin.ridha@gmail.com</span>

                </p>
              </div>
            </div>

            {/* Card Telepon */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-50 flex items-start gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 text-[#1f6f3f]">
                ☎️
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Call Center</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sahwa Fidya <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">24 Jam</span><br />
                  WhatsApp: 0895-3249-47770
                </p>
              </div>
            </div>

          </div>

          {/* --- KOLOM KANAN: Formulir Pesan --- */}
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 relative overflow-hidden">
            
            {/* Dekorasi Background Abstrak */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0 opacity-50"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Kirim Pesan Langsung</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center animate-pulse flex flex-col items-center justify-center h-80">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-4">
                    ✅
                  </div>
                  <p className="font-bold text-lg">Pesan Terkirim!</p>
                  <p className="text-sm text-green-700 mt-2">Terima kasih atas masukan Anda. Tim kami akan segera merespons.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium text-slate-700" 
                      placeholder="Masukkan nama Anda" 
                      required 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium text-slate-700" 
                      placeholder="contoh@email.com" 
                      required 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 ml-1">Pesan / Masukan</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none font-medium text-slate-700" 
                      placeholder="Tuliskan detail pertanyaan atau saran Anda di sini..." 
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1f6f3f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#185632] hover:-translate-y-1 transition-all duration-300 mt-2"
                  >
                    Kirim Pesan 🚀
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}