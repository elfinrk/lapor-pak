"use client";

import { useState, useRef } from "react";
import { createReportAction } from "@/actions/report.actions";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
// Import library kompresi
import imageCompression from "browser-image-compression";

const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 animate-pulse border border-slate-200">
      <p>Memuat Peta...</p>
    </div>
  ),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#1f6f3f] text-white font-bold py-3 rounded-xl hover:bg-[#185632] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Sedang Mengirim Laporan..." : "Kirim Laporan"}
    </button>
  );
}

export default function LaporanFormClient() {
  const [message, setMessage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  
  const [isCompressing, setIsCompressing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    setMessage("");
    
    // 1. Validasi Lokasi
    if (!selectedLocation) {
      setMessage("Harap pilih lokasi pada peta.");
      return;
    }

    // 2. Ambil Foto dari FormData
    const photo = formData.get("photo") as File;
    
    // 3. LOGIKA KOMPRESI (Mencegah Vercel Timeout)
    if (photo && photo.size > 0) {
      setIsCompressing(true);
      const options = {
        maxSizeMB: 1,           // Target ukuran di bawah 1MB
        maxWidthOrHeight: 1280, // Resolusi maksimal (HD)
        useWebWorker: true,
      };
      
      try {
        const compressedFile = await imageCompression(photo, options);
        // Ganti file asli yang besar dengan file hasil kompresi
        formData.set("photo", compressedFile);
        console.log(`Original size: ${(photo.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      } catch (error) {
        console.error("Gagal kompres foto:", error);
      } finally {
        setIsCompressing(false);
      }
    }

    // 4. Tambahkan data lokasi ke FormData
    formData.set("location", selectedLocation.address);
    formData.append("latitude", selectedLocation.lat.toString());
    formData.append("longitude", selectedLocation.lng.toString());

    try {
      // 5. Kirim ke Server Action
      const res = await createReportAction(formData);
      
      if (res?.success) {
        setMessage("✅ " + res.message);
        formRef.current?.reset();
        setSelectedLocation(null);
      } else {
        setMessage("❌ " + (res?.message || "Gagal mengirim laporan."));
      }
    } catch (err) {
      setMessage("❌ Terjadi kesalahan jaringan. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Buat Laporan</h1>
        <p className="text-slate-500 mb-6">Sampaikan masalah lingkungan di sekitarmu.</p>

        <form ref={formRef} action={handleAction} className="space-y-5">
          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Kategori *</label>
            <select name="category" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white outline-none focus:ring-2 focus:ring-green-500">
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
            <textarea name="description" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 h-32 focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="Jelaskan detail kejadian..."></textarea>
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
            {isCompressing && <p className="text-[10px] text-blue-500 animate-pulse">Sedang mengoptimalkan foto...</p>}
          </div>

          <SubmitButton />
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}