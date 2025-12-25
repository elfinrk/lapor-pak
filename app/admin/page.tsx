import {
  getAllReports,
  getReportStats,
  updateReportStatus,
  deleteReportAction,
} from "@/actions/report.actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { 
  LayoutDashboard, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Trash2, 
  ExternalLink,
  MapPin,
  Calendar,
  User,
  MoreVertical
} from "lucide-react";

// --- HELPER: FORMAT TANGGAL ---
const formatTanggalWIB = (isoString: string) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const [reports, stats] = await Promise.all([
    getAllReports(),
    getReportStats(),
  ]);

  async function changeStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as any;
    await updateReportStatus(id, status);
    revalidatePath("/admin");
  }

  return (
    <main className="min-h-screen bg-[#0d0d10] text-slate-300 py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <LayoutDashboard className="text-emerald-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Panel Kontrol Admin</h1>
              <p className="text-slate-500 text-sm mt-1">Pantau dan kelola laporan infrastruktur kota secara efisien.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Sistem Aktif</span>
          </div>
        </div>

        {/* RINGKASAN STATISTIK */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Masuk" value={stats.total} icon={<BarChart3 />} color="emerald" />
          <StatCard title="Menunggu" value={stats.pending} icon={<Clock />} color="slate" />
          <StatCard title="Dikerjakan" value={stats.proses} icon={<Loader2 />} color="amber" />
          <StatCard title="Tuntas" value={stats.selesai} icon={<CheckCircle2 />} color="blue" />
        </section>

        {/* TABEL LAPORAN */}
        <section className="bg-[#16161a] border border-slate-800/60 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800/50 bg-slate-800/20 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Daftar Laporan Terbaru
            </h2>
            <div className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full uppercase">
              {reports.length} Data Tersedia
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-slate-500 uppercase text-[10px] tracking-[0.2em] bg-slate-800/10">
                  <th className="px-8 py-5 font-semibold text-left">Pelapor</th>
                  <th className="px-8 py-5 font-semibold text-left">Detail Masalah</th>
                  <th className="px-8 py-5 font-semibold text-left">Lokasi</th>
                  <th className="px-8 py-5 font-semibold text-center">Lampiran</th>
                  <th className="px-8 py-5 font-semibold text-center">Status</th>
                  <th className="px-8 py-5 font-semibold text-right">Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {reports.map((report: any) => (
                  <tr key={report.id} className="hover:bg-slate-800/20 transition-all group">
                    
                    {/* PELAPOR */}
                    <td className="px-8 py-6 align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-white font-bold flex items-center gap-2">
                          <User size={14} className="text-slate-500" />
                          {report.authorName}
                        </span>
                        <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formatTanggalWIB(report.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* DETAIL MASALAH */}
                    <td className="px-8 py-6 align-top max-w-xs">
                      <div className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
                        {report.category}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 italic group-hover:line-clamp-none transition-all">
                        "{report.description || "Tanpa rincian"}"
                      </p>
                    </td>

                    {/* LOKASI */}
                    <td className="px-8 py-6 align-top min-w-[220px]">
                      <div className="flex gap-2 text-slate-400 text-[11px] leading-relaxed">
                        <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <span className="break-words">{report.location}</span>
                      </div>
                    </td>

                    {/* LAMPIRAN */}
                    <td className="px-8 py-6 align-top text-center">
                      {report.photoUrl ? (
                        <div className="flex justify-center">
                          <a href={report.photoUrl} target="_blank" className="relative group/img block">
                            <img 
                              src={report.photoUrl} 
                              alt="Bukti" 
                              className="w-11 h-11 object-cover rounded-xl border-2 border-slate-700/50 group-hover/img:border-emerald-500 transition-all shadow-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/60 opacity-0 group-hover/img:opacity-100 rounded-xl transition-all">
                              <ExternalLink size={12} className="text-white" />
                            </div>
                          </a>
                        </div>
                      ) : (
                        <div className="text-slate-700 italic text-[10px]">Tiada Foto</div>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-8 py-6 align-top text-center">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* AKSI */}
                    <td className="px-8 py-6 align-top text-right space-y-4">
                      <form action={changeStatus} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="id" value={report.id} />
                        <select 
                          name="status" 
                          defaultValue={report.status}
                          className="bg-slate-900 border border-slate-700 text-[10px] font-bold rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                        >
                          <option value="pending">PENDING</option>
                          <option value="proses">PROSES</option>
                          <option value="selesai">SELESAI</option>
                        </select>
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shadow-lg shadow-emerald-900/20">
                          Update
                        </button>
                      </form>
                      
                      <form action={async (fd) => {
                        "use server";
                        await deleteReportAction(fd.get("id") as string);
                        revalidatePath("/admin");
                      }}>
                        <input type="hidden" name="id" value={report.id} />
                        <button className="text-slate-600 hover:text-rose-500 transition-all text-[9px] font-bold flex items-center gap-1 justify-end ml-auto group/del">
                          <Trash2 size={11} className="group-hover/del:scale-110" />
                          Hapus Data
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

// --- SUB-KOMPONEN ---
function StatCard({ title, value, icon, color }: any) {
  const themes: any = {
    emerald: "from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-400",
    slate: "from-slate-500/20 via-slate-500/5 to-transparent border-slate-500/20 text-slate-400",
    amber: "from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/20 text-amber-400",
    blue: "from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/20 text-blue-400",
  };

  return (
    <div className={`bg-gradient-to-br ${themes[color]} border rounded-[2rem] p-6 shadow-sm backdrop-blur-sm transition-transform hover:scale-[1.02] duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{title}</span>
        <div className="p-2 bg-black/20 rounded-lg">{icon}</div>
      </div>
      <p className="text-4xl font-bold text-white tabular-nums tracking-tighter">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    selesai: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    proses: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    pending: "bg-slate-700/30 text-slate-500 border-slate-700/50"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status === 'proses' && <Loader2 size={10} className="animate-spin mr-1.5" />}
      {status}
    </span>
  );
}