import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getReportsForUser } from "@/actions/report.actions";
import Link from "next/link";

function formatTanggal(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: string }) {
  const color = status === "selesai" ? "bg-green-100 text-green-700 border-green-200" : status === "proses" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-slate-100 text-slate-700 border-slate-200";
  return <span className={`px-2 py-1 rounded text-xs font-bold border ${color} uppercase`}>{status}</span>;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reports = await getReportsForUser(user.id);

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Laporan</h1>
          <p className="text-slate-500">Daftar laporan yang pernah kamu kirim.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Belum ada laporan. <Link href="/laporan" className="text-green-600 font-bold hover:underline">Buat Laporan</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Foto</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3">Lokasi</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report: any) => (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600">{formatTanggal(report.createdAt)}</td>
                      <td className="px-6 py-4">
                        {report.photoUrl ? (
                          <a href={report.photoUrl} target="_blank" className="block w-12 h-12 rounded overflow-hidden border border-slate-200 hover:border-green-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={report.photoUrl} alt="Bukti" className="w-full h-full object-cover" />
                          </a>
                        ) : <span className="text-xs text-slate-400 italic">Tanpa foto</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-700 capitalize font-medium">{report.category}</td>
                      <td className="px-6 py-4 text-slate-600">{report.location}</td>
                      <td className="px-6 py-4"><StatusBadge status={report.status} /></td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{report.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}