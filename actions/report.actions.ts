"use server";

import { connectDB } from "@/lib/db";
import { Report } from "@/models/report.model";
import { User } from "@/models/user.model"; 
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Menerima data laporan.
 * Foto sudah diupload di client, jadi kita hanya menerima photoUrl (string).
 */
export async function createReportAction(formData: FormData) {
  const user = await getCurrentUser();
  
  // PROTEKSI GANDA: Cek lagi di sini
  if (!user) {
    return { success: false, message: "Akses ditolak. Anda harus login." };
  }

  const category = String(formData.get("category") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  
  // Ambil photoUrl yang dikirim dari LaporanFormClient (Direct Upload)
  const photoUrl = String(formData.get("photoUrl") || "").trim();
  
  if (!category || !location || !description) {
    return { success: false, message: "Semua field wajib diisi." };
  }

  try {
    await connectDB();

    const report = await Report.create({
      userId: user.id,
      category,
      location,
      description,
      photoUrl, // Menyimpan URL Cloudinary langsung ke database
      status: "pending",
    });

    // Segarkan data di halaman terkait
    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Laporan berhasil dikirim!",
      reportId: report._id.toString(),
    };
  } catch (err) {
    console.error("Database Error:", err);
    return { success: false, message: "Gagal menyimpan ke database." };
  }
}

/**
 * Mengambil semua laporan untuk Panel Admin (dengan nama pelapor)
 */
export async function getAllReports() {
  try {
    await connectDB();
    
    const reports = await Report.find()
      .populate("userId", "name") 
      .sort({ createdAt: -1 })
      .lean();

    return reports.map((r: any) => ({
      id: r._id.toString(),
      authorName: r.userId?.name || "User Tidak Ditemukan",
      category: r.category,
      location: r.location,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      photoUrl: r.photoUrl,
    }));
  } catch (err) {
    console.error("Error getAllReports:", err);
    return [];
  }
}

/**
 * Mengambil laporan khusus milik user yang sedang login
 */
export async function getReportsForUser(userId: string) {
  try {
    await connectDB();

    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return reports.map((r: any) => ({
      id: r._id.toString(),
      category: r.category,
      location: r.location,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      photoUrl: r.photoUrl || "",
    }));
  } catch (err) {
    console.error("Gagal mengambil laporan user:", err);
    return [];
  }
}

/**
 * Mengambil statistik laporan untuk Panel Admin
 */
export async function getReportStats() {
  try {
    await connectDB();
    return {
      total: await Report.countDocuments(),
      pending: await Report.countDocuments({ status: "pending" }),
      proses: await Report.countDocuments({ status: "proses" }),
      selesai: await Report.countDocuments({ status: "selesai" }),
    };
  } catch (err) {
    return { total: 0, pending: 0, proses: 0, selesai: 0 };
  }
}

/**
 * Update status laporan oleh Admin
 */
export async function updateReportStatus(id: string, status: string) {
  try {
    await connectDB();
    await Report.findByIdAndUpdate(id, { status });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

/**
 * Menghapus laporan oleh Admin
 */
export async function deleteReportAction(id: string) {
  try {
    await connectDB();
    await Report.findByIdAndDelete(id);
    revalidatePath("/admin");
    return { success: true, message: "Laporan berhasil dihapus" };
  } catch (err) {
    return { success: false, message: "Gagal menghapus laporan" };
  }
}