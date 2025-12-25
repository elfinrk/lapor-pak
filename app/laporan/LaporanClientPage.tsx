"use client";

import { useState, useRef } from "react";
import { createReportAction } from "@/actions/report.actions";
import dynamic from "next/dynamic";
import imageCompression from "browser-image-compression";

// Load MapPicker tanpa Server Side Rendering (SSR)
const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 rounded-lg border border-slate-200">
      Memuat Peta...
    </div>
  ),
});

export default function LaporanFormClient() {
  const [message, setMessage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);
    setMessage(""); // Reset pesan
    
    const formData = new FormData(e.currentTarget);
    const photo = formData.get("photo") as File;

    // 1. Validasi Lokasi
    if (!selectedLocation) {
      setMessage("❌ Harap pilih lokasi pada peta.");
      setLoading(false);
      return;
    }

    // --- DEBUG 1: Cek Cloud Name ---
    // Kita gunakan fallback string hardcode agar tetap jalan meski env belum masuk Vercel
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqnkziua0";
    
    if (!cloudName) {
      setMessage("❌ Error Fatal: Cloud Name tidak ditemukan / kosong.");
      setLoading(false);
      return;
    }

    let finalPhotoUrl = "";

    try {
      // 2. PROSES UPLOAD FOTO (Jika ada)
      if (photo && photo.size > 0) {
        setMessage("⏳ Mengompres foto...");

        // A. Kompresi
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true };
        let compressedFile;
        try {
            compressedFile = await imageCompression(photo, options);
        } catch (err) {
            throw new Error("Gagal kompresi di HP. Coba foto lain.");
        }

        setMessage("⏳ Mengupload ke Cloudinary...");

        // B. Upload ke Cloudinary
        const uploadPreset = "ml_default"; // Pastikan SAMA PERSIS dengan di Cloudinary
        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        uploadData.append("upload_preset", uploadPreset);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: uploadData }
        );

        const cloudinaryData = await cloudinaryRes.json();
        
        // --- DEBUG 2: Cek Error Cloudinary ---
        if (!cloudinaryRes.ok) {
            // Tampilkan pesan error ASLI dari Cloudinary ke layar HP
            const errorMsg = cloudinaryData.error?.message || "Unknown Cloudinary Error";
            throw new Error(`Gagal Upload Cloudinary: ${errorMsg}`);
        }
        
        finalPhotoUrl = cloudinaryData.secure_url;
      }

      // 3. KIRIM DATA KE DATABASE
      setMessage("⏳ Menyimpan data laporan...");
      
      const dataToSend = new FormData();
      dataToSend.append("category", formData.get("category") as string);
      dataToSend.append("description", formData.get("description") as string);
      dataToSend.append("location", selectedLocation.address);
      dataToSend.append("latitude", selectedLocation.lat.toString());
      dataToSend.append("longitude", selectedLocation.lng.toString());
      dataToSend.append("photoUrl", finalPhotoUrl);

      const res = await createReportAction(dataToSend);
      
      if (res?.success) {
        setMessage("✅ BERHASIL! Laporan terkirim.");
        formRef.current?.reset();
        setSelectedLocation(null);
      } else {
        throw new Error(`Gagal Database: ${res?.message}`);
      }
    } catch (err: any) {
      console.error("Error Debug:", err);
      // Tampilkan error lengkap di layar
      setMessage(`❌ ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Buat Laporan</h1>
        <p className="text-slate-500 mb-6 text-sm">Sampaikan masalah lingkungan di sekitarmu.</p>

        <form ref={formRef} onSubmit={handleAction} className="space-y-5">
          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Kategori *</label>
            <select 
              name="category" 
              required 
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="" disabled selected>Pilih Kategori...</option>
              <option value="lingkungan">Lingkungan</option>
              <option value="fasilitas">Fasilitas Umum</option>
              <option value="keamanan">Keamanan</option>
            </select>
          </div>

          {/* MAPS */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Lokasi Kejadian *</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <MapPicker onLocationSelect={setSelectedLocation} />
            </div>
            {selectedLocation && (
              <p className="text-[10px] text-green-700 mt-1 italic">📍 {selectedLocation.address}</p>
            )}
          </div>

          {/* DESKRIPSI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Deskripsi *</label>
            <textarea 
              name="description" 
              required 
              className="w-full border border-slate-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-green-500 outline-none resize-none" 
              placeholder="Jelaskan detail kejadian..."
            ></textarea>
          </div>

          {/* FOTO BUKTI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Foto Bukti</label>
            <input 
              type="file" 
              name="photo" 
              accept="image/*" 
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
            />
          </div>

          {/* TOMBOL SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1f6f3f] text-white font-bold py-3 rounded-xl hover:bg-[#185632] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Memproses..." : "Kirim Laporan"}
          </button>
        </form>

        {/* PESAN STATUS (Kotak Pesan Error/Sukses) */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center text-sm font-bold break-words ${
            message.includes("✅") ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}