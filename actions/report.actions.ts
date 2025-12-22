"use server";

import { connectDB } from "@/lib/db";
import { Report } from "@/models/report.model";
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
      // Convert file ke Buffer agar bisa diupload
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
      userId: user.id,
      category,
      location,
      description,
      photoUrl, // Simpan URL foto ke database
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

// --- FUNGSI AMBIL DATA (PENTING: Tambahkan photoUrl) ---

export async function getAllReports() {
  try {
    await connectDB();
    const reports = await Report.find().sort({ createdAt: -1 }).lean();
    return reports.map((r: any) => ({
      id: r._id.toString(),
      category: r.category,
      location: r.location,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt,
      photoUrl: r.photoUrl, // <--- WAJIB ADA
    }));
  } catch (err) {
    return [];
  }
}

export async function getReportsForUser(userId: string) {
  try {
    await connectDB();
    const reports = await Report.find({ userId }).sort({ createdAt: -1 }).lean();
    return reports.map((r: any) => ({
      id: r._id.toString(),
      category: r.category,
      location: r.location,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt,
      photoUrl: r.photoUrl, // <--- WAJIB ADA
    }));
  } catch (err) {
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