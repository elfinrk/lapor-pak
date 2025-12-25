import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getReportsForUser } from "@/actions/report.actions";
import Link from "next/link";
import { CheckCircle2, Clock, Search, MessageCircle, Info, MapPin } from "lucide-react";

// --- FORMAT TANGGAL ---
function formatTanggal(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// --- KOMPONEN: ProgressTimeline (Pending -> Proses -> Selesai) ---
function ProgressTimeline({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { id: "pending", label: "Pending", icon: <Clock size={14} /> },
    { id: "proses", label: "Proses", icon: <Search size={14} /> },
    { id: "selesai", label: "Selesai", icon: <CheckCircle2 size={14} /> },
  ];

  const statusLower = currentStatus.toLowerCase();
  const currentIndex = steps.findIndex((step) => step.id === statusLower);
  // Default ke 0 jika status tidak cocok
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center max-w-[450px] mx-auto md:mx-0">
        {/* Jalur Background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        
        {/* Jalur Aktif (Garis Hijau) */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-green-600 -translate-y-1/2 transition-all duration-700 z-0" 
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100"
                    : "bg-white border-slate-200 text-slate-300"
                } ${isCurrent ? "scale-110 ring-4 ring-green-50" : ""}`}
              >
                {step.icon}
              </div>
              <span 
                className={`absolute -bottom-7 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                  isCompleted ? "text-green-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reports = await getReportsForUser(user.id);
  
  // Nomor WA Admin yang Anda berikan (Format internasional tanpa simbol + atau spasi)
  const adminWhatsApp = "62895324947770"; 

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* KOLOM KIRI: RIWAYAT LAPORAN */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Laporan</h1>
            <p className="text-slate-500 text-sm">Cek status laporan Anda yang tersinkronisasi langsung dengan sistem petugas kami.</p>
          </div>

          <div className="space-y-6">
            {reports.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 mb-6 font-medium">Anda belum mengirimkan laporan apapun.</p>
                <Link href="/laporan" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                  Buat Laporan Sekarang
                </Link>
              </div>
            ) : (
              reports.map((report: any) => (
                <div key={report.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                  {/* Bagian Atas Card */}
                  <div className="p-6 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                        {report.photoUrl ? (
                          <img src={report.photoUrl} alt="Bukti" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-slate-300 font-bold uppercase tracking-tighter">No Photo</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg capitalize leading-tight">{report.category}</h3>
                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                          <Clock size={12} /> {formatTanggal(report.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Bawah Card: Timeline & Info */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                       <ProgressTimeline currentStatus={report.status} />
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Info size={12} /> Informasi Detail
                       </p>
                       <p className="text-xs text-slate-700 font-bold mb-2 flex items-start gap-1">
                         <MapPin size={12} className="text-green-600 shrink-0 mt-0.5" /> {report.location}
                       </p>
                       <div className="h-px bg-slate-200 my-2" />
                       <p className="text-xs text-slate-500 leading-relaxed italic">"{report.description}"</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* KOLOM KANAN: SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* FITUR TAMBAHAN: TIPS */}
          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-xl shadow-green-900/5 group transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-600 p-2 rounded-xl text-white">
                <Info size={16} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Edukasi Melapor</h3>
            </div>
            <div className="aspect-video rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
               <MapPin size={40} className="text-orange-500 animate-bounce" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Deskripsi Lokasi Presisi</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sertakan patokan bangunan atau nama jalan yang spesifik pada deskripsi. Deskripsi yang jelas membantu tim lapangan menemukan lokasi 40% lebih cepat.
            </p>
          </div>

          {/* CHAT ADMIN WA */}
          <div className="bg-green-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-200 relative overflow-hidden group">
             <div className="relative z-10">
               <h4 className="font-bold mb-3 flex items-center gap-2 text-base">
                 <MessageCircle size={20} /> Butuh Bantuan?
               </h4>
               <p className="text-[11px] text-green-50 leading-relaxed mb-6 font-medium">
                 Jika laporan Anda belum ditanggapi dalam 3 hari kerja, silakan hubungi layanan pelanggan kami.
               </p>
               <a 
                href={`https://wa.me/${adminWhatsApp}?text=Halo%20Admin%20Lapor%20Pak,%20saya%20ingin%20menanyakan%20perkembangan%20laporan%20saya.`}
                target="_blank"
                className="block w-full py-4 bg-white text-green-600 rounded-2xl font-bold text-xs text-center hover:scale-105 transition-all shadow-md active:scale-95"
               >
                 Hubungi Kami via WA
               </a>
             </div>
             {/* Ikon Dekorasi Besar di Background */}
             <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <MessageCircle size={120} />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}