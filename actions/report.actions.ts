"use server";

import { connectDB } from "@/lib/db";
import { Report } from "@/models/report.model";
import { User } from "@/models/user.model"; // Wajib import model User untuk populate
import { getCurrentUser } from "@/lib/auth";
import { uploadImageBuffer, REPORT_FOLDER } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createReportAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Anda harus login untuk mengirim laporan." };
  }

  const category = String(formData.get("category") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const photoFile = formData.get("photo") as File | null;
  
  if (!category || !location || !description) {
    return { success: false, message: "Semua field wajib diisi." };
  }

  let photoUrl = "";

  if (photoFile && photoFile.size > 0) {
    try {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      photoUrl = await uploadImageBuffer(buffer, REPORT_FOLDER);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return { success: false, message: "Gagal mengupload foto." };
    }
  }

  try {
    await connectDB();

    const report = await Report.create({
      userId: user.id, // Pastikan di model Report field-nya bernama 'userId'
      category,
      location,
      description,
      photoUrl, 
      status: "pending",
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Laporan berhasil dikirim!",
      reportId: report._id.toString(),
    };
  } catch (err) {
    return { success: false, message: "Gagal menyimpan ke database." };
  }
}

export async function getAllReports() {
  try {
    await connectDB();
    
    // PENTING: .populate('userId', 'name') mengambil field 'name' dari tabel User
    const reports = await Report.find()
      .populate("userId", "name") 
      .sort({ createdAt: -1 })
      .lean();

    return reports.map((r: any) => ({
      id: r._id.toString(),
      authorName: r.userId?.name || "User Tidak Ditemukan", // Ini agar tidak "Anonim"
      category: r.category,
      location: r.location,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      photoUrl: r.photoUrl, // URL gambar dari Cloudinary
    }));
  } catch (err) {
    console.error("Error getAllReports:", err);
    return [];
  }
}

export async function getReportStats() {
  await connectDB();
  return {
    total: await Report.countDocuments(),
    pending: await Report.countDocuments({ status: "pending" }),
    proses: await Report.countDocuments({ status: "proses" }),
    selesai: await Report.countDocuments({ status: "selesai" }),
  };
}

export async function updateReportStatus(id: string, status: string) {
  await connectDB();
  await Report.findByIdAndUpdate(id, { status });
  return { success: true };
}

export async function deleteReportAction(id: string) {
  try {
    await connectDB();
    // Jika ada sistem hapus file Cloudinary, bisa ditambahkan di sini
    await Report.findByIdAndDelete(id);
    return { success: true, message: "Laporan dihapus" };
  } catch (err) {
    return { success: false, message: "Gagal menghapus" };
  }
}

// actions/report.actions.ts

// ... (kode lainnya seperti connectDB, Report model, dll)

/**
 * Fungsi untuk mengambil daftar laporan berdasarkan ID User tertentu
 * Digunakan di halaman Dashboard
 */
export async function getReportsForUser(userId: string) {
  try {
    await connectDB(); // Pastikan koneksi DB terpanggil

    // Mencari laporan yang memiliki userId sesuai dengan parameter
    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 }) // Urutkan dari yang terbaru
      .lean();

    // Mapping data agar aman dikirim ke Client Component
    return reports.map((r: any) => ({
      id: r._id.toString(),
      category: r.category,
      location: r.location,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt.toISOString(), // Convert ke string untuk menghindari error serialisasi
      photoUrl: r.photoUrl || "",
    }));
  } catch (err) {
    console.error("Gagal mengambil laporan user:", err);
    return []; // Kembalikan array kosong jika terjadi error
  }
}

// ... (fungsi lainnya seperti getAllReports, getReportStats, dll)