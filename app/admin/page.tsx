import {
  getAllReports,
  getReportStats,
  updateReportStatus,
} from "@/actions/report.actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  const [reports, stats] = await Promise.all([
    getAllReports(),
    getReportStats(),
  ]);

  async function changeStatus(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const status = formData.get("status") as "pending" | "proses" | "selesai";

    await updateReportStatus(id, status);

    revalidatePath("/admin");
    revalidatePath("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-10 bg-background">
      <div className="w-full max-w-6xl space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Total Laporan</p>
            <p className="text-2xl font-semibold text-slate-50">
              {stats.total}
            </p>
          </div>
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Pending</p>
            <p className="text-2xl font-semibold text-slate-100">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Proses</p>
            <p className="text-2xl font-semibold text-amber-300">
              {stats.proses}
            </p>
          </div>
          <div className="bg-white/5 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Selesai</p>
            <p className="text-2xl font-semibold text-emerald-300">
              {stats.selesai}
            </p>
          </div>
        </section>

        <section className="bg-white/5 border border-slate-800 shadow-md rounded-2xl p-6">
          <h1 className="text-2xl font-semibold mb-2">Panel Admin</h1>
          <p className="text-sm text-slate-300 mb-4">
            Kelola laporan yang masuk: ubah status menjadi &quot;proses&quot; atau
            &quot;selesai&quot; sesuai penanganan di lapangan.
          </p>

          {reports.length === 0 ? (
            <p className="text-sm text-slate-400">
              Belum ada laporan yang tersimpan.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 text-left">
                    <th className="px-3 py-2 border-b border-slate-700">
                      Tanggal
                    </th>
                    <th className="px-3 py-2 border-b border-slate-700">
                      Kategori
                    </th>
                    <th className="px-3 py-2 border-b border-slate-700">
                      Lokasi
                    </th>
                    <th className="px-3 py-2 border-b border-slate-700">
                      Status
                    </th>
                    <th className="px-3 py-2 border-b border-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report: any) => (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-3 py-2 border-b border-slate-800 align-top">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800 align-top capitalize">
                        {report.category || "-"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800 align-top">
                        {report.location || "-"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800 align-top">
                        <span
                          className={
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium " +
                            (report.status === "selesai"
                              ? "bg-emerald-200/20 text-emerald-300"
                              : report.status === "proses"
                              ? "bg-amber-200/20 text-amber-300"
                              : "bg-slate-200/10 text-slate-200")
                          }
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-b border-slate-800 align-top">
                        <form action={changeStatus} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={report.id} />
                          <select
                            name="status"
                            defaultValue={report.status}
                            className="border border-slate-700 bg-slate-900 rounded px-2 py-1 text-xs"
                          >
                            <option value="pending">pending</option>
                            <option value="proses">proses</option>
                            <option value="selesai">selesai</option>
                          </select>
                          <button
                            type="submit"
                            className="px-3 py-1 rounded-full text-xs bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Simpan
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
