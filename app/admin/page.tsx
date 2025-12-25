import {
  getAllReports,
  getReportStats,
  updateReportStatus,
  deleteReportAction,
} from "@/actions/report.actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- HELPER: FORMAT TANGGAL KE WIB ---
const formatTanggalWIB = (isoString: string) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta", // Wajib set ke Jakarta agar WIB
    day: "numeric",
    month: "short", // Contoh: 25 Des
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Format 24 jam
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

  // Server Action untuk Ganti Status
  async function changeStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as any;
    await updateReportStatus(id, status);
    revalidatePath("/admin");
  }

  return (
    <main className="min-h-screen bg-black text-slate-200 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* STATS SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-slate-400">{stats.pending}</p>
          </div>
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Proses</p>
            <p className="text-2xl font-bold text-amber-500">{stats.proses}</p>
          </div>
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Selesai</p>
            <p className="text-2xl font-bold text-emerald-500">{stats.selesai}</p>
          </div>
        </section>

        {/* TABLE SECTION */}
        <section className="bg-white/5 border border-slate-800 rounded-2xl p-6 overflow-hidden">
          <h1 className="text-2xl font-bold mb-6">Panel Admin</h1>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-500 uppercase text-[10px] tracking-widest">
                  <th className="px-4 py-3">Tanggal (WIB)</th>
                  <th className="px-4 py-3">Pelapor</th>
                  <th className="px-4 py-3">Kategori & Deskripsi</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Bukti</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report: any) => (
                  <tr key={report.id} className="bg-slate-900/50 hover:bg-slate-800/50 transition-all">
                    
                    {/* TANGGAL (SUDAH DIPERBAIKI) */}
                    <td className="px-4 py-4 text-slate-400 whitespace-nowrap align-top font-mono text-xs">
                      {formatTanggalWIB(report.createdAt)}
                    </td>

                    {/* PELAPOR */}
                    <td className="px-4 py-4 font-bold text-white align-top">
                      {report.authorName}
                    </td>

                    {/* KATEGORI & DESKRIPSI */}
                    <td className="px-4 py-4 align-top max-w-xs">
                      <div className="font-semibold text-emerald-400 text-xs mb-1 uppercase tracking-wider">
                        {report.category}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed italic break-words">
                        "{report.description || "Tidak ada deskripsi"}"
                      </p>
                    </td>

                    {/* LOKASI */}
                    <td className="px-4 py-4 text-xs text-slate-300 min-w-[200px] max-w-[300px] whitespace-normal break-words leading-relaxed align-top">
                      {report.location}
                    </td>

                    {/* BUKTI FOTO */}
                    <td className="px-4 py-4 align-top">
                      {report.photoUrl ? (
                        <a href={report.photoUrl} target="_blank" className="relative group block w-12 h-12">
                          <img 
                            src={report.photoUrl} 
                            alt="Bukti" 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-700 group-hover:border-emerald-500 transition-all"
                          />
                        </a>
                      ) : (
                        <span className="text-slate-600 italic text-[10px]">No Photo</span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4 text-center align-top">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        report.status === 'selesai' ? 'bg-emerald-500/10 text-emerald-400' :
                        report.status === 'proses' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-700/50 text-slate-400'
                      }`}>
                        {report.status}
                      </span>
                    </td>

                    {/* AKSI */}
                    <td className="px-4 py-4 text-right align-top space-y-2">
                      {/* FORM UPDATE STATUS */}
                      <form action={changeStatus} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="id" value={report.id} />
                        <select 
                          name="status" 
                          defaultValue={report.status}
                          className="bg-black border border-slate-700 text-[11px] rounded px-2 py-1 outline-none"
                        >
                          <option value="pending">pending</option>
                          <option value="proses">proses</option>
                          <option value="selesai">selesai</option>
                        </select>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-[11px] font-bold">
                          Simpan
                        </button>
                      </form>
                      
                      {/* FORM DELETE (Tanpa Confirm karena Server Component) */}
                      <form action={async (fd) => {
                        "use server";
                        await deleteReportAction(fd.get("id") as string);
                        revalidatePath("/admin");
                      }}>
                        <input type="hidden" name="id" value={report.id} />
                        <button className="text-red-500 hover:text-red-400 text-[10px] font-bold underline px-1">
                          Hapus Laporan
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