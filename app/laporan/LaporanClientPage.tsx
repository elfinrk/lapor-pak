"use client";

import { useState, useRef, useEffect } from "react";
import { createReportAction } from "@/actions/report.actions";
import dynamic from "next/dynamic";
import imageCompression from "browser-image-compression";

// Load MapPicker secara Lazy
const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 animate-pulse">
      <p>Memuat Peta...</p>
    </div>
  ),
});

export default function LaporanFormClient() {
  const [message, setMessage] = useState("");
  
  // State Lokasi
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // State Submit Utama
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("Kirim Laporan");

  // --- STATE KHUSUS FOTO ---
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isPhotoReady, setIsPhotoReady] = useState(false); // Penanda foto "siap" secara visual

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLE FILE CHANGE (Hanya Visual) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    // Reset state foto
    setFile(null);
    setFileError("");
    setIsPhotoReady(false);

    if (selectedFile) {
      // Validasi Tipe
      if (!selectedFile.type.startsWith("image/")) {
        setFileError("⚠️ File harus berupa gambar.");
        event.target.value = "";
        return;
      }
      // Validasi Ukuran Awal (10MB limit hard)
      if (selectedFile.size > 10 * 1024 * 1024) {
         setFileError("⚠️ File terlalu besar (Max 10MB).");
         return;
      }

      setFile(selectedFile);
      setIsPhotoReady(true); // Tampilkan UI hijau "Foto Siap"
    }
  };

  // --- HANDLE HAPUS FOTO ---
  const handleRemovePhoto = () => {
    setFile(null);
    setFileError("");
    setIsPhotoReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- HANDLE SUBMIT FORM (LOGIKA UTAMA) ---
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMessage("");
    setIsSubmitting(true);
    setLoadingText("🔄 Mempersiapkan...");

    try {
      // 1. Validasi Manual
      const category = formData.get("category");
      const description = formData.get("description");

      if (!category || !description) {
        throw new Error("Harap isi kategori dan deskripsi.");
      }

      if (!selectedLocation) {
        throw new Error("Harap pilih titik lokasi pada peta.");
      }

      let finalPhotoUrl = "";

      // 2. PROSES UPLOAD KE CLOUDINARY (Direct Upload Logic)
      if (file) {
        setLoadingText("⏳ Mengompres Foto...");
        
        // A. Kompresi Gambar
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true };
        let compressedFile;
        try {
            compressedFile = await imageCompression(file, options);
        } catch (err) {
            console.error(err);
            compressedFile = file; // Fallback pakai file asli jika gagal kompres
        }

        setLoadingText("☁️ Mengupload Foto...");

        // B. Siapkan Data Upload
        // Gunakan ENV Variable (Pastikan sudah redeploy Vercel)
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqnkziua0"; 
        const uploadPreset = "ml_default"; 

        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        uploadData.append("upload_preset", uploadPreset);

        // C. Fetch ke Cloudinary
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: uploadData }
        );

        const cloudinaryData = await cloudinaryRes.json();

        if (!cloudinaryRes.ok) {
            throw new Error(cloudinaryData.error?.message || "Gagal Upload Foto ke Cloudinary");
        }

        finalPhotoUrl = cloudinaryData.secure_url;
      }

      // 3. KIRIM DATA TEXT KE SERVER DATABASE
      setLoadingText("💾 Menyimpan Laporan...");

      const dataToSend = new FormData();
      dataToSend.append("category", category as string);
      dataToSend.append("description", description as string);
      dataToSend.append("location", selectedLocation.address);
      dataToSend.append("latitude", selectedLocation.lat.toString());
      dataToSend.append("longitude", selectedLocation.lng.toString());
      dataToSend.append("photoUrl", finalPhotoUrl); // URL Foto dari Cloudinary

      const res = await createReportAction(dataToSend);

      if (res?.success) {
        setMessage("✅ BERHASIL! Laporan telah dikirim.");
        formRef.current?.reset();
        setSelectedLocation(null);
        handleRemovePhoto();
      } else {
        throw new Error(res?.message || "Gagal menyimpan laporan.");
      }

    } catch (err: any) {
      console.error("SUBMIT ERROR:", err);
      // Tampilkan error spesifik agar tahu salah dimana
      setMessage(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setLoadingText("Kirim Laporan");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Buat Laporan</h1>
        <p className="text-slate-500 mb-6">Sampaikan masalah lingkungan di sekitarmu.</p>

        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Kategori *</label>
            <select
              name="category"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 bg-white focus:ring-2 focus:ring-green-500 outline-none"
              required
              defaultValue=""
            >
              <option value="" disabled>Pilih Kategori...</option>
              <option value="lingkungan">Lingkungan</option>
              <option value="fasilitas">Fasilitas Umum</option>
              <option value="keamanan">Keamanan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* LOKASI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Lokasi *</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
                <MapPicker onLocationSelect={setSelectedLocation} />
            </div>
            {selectedLocation ? (
                <p className="text-xs text-green-700 mt-1 bg-green-50 p-2 rounded border border-green-100">
                    📍 <strong>Lokasi Terpilih:</strong> {selectedLocation.address}
                </p>
            ) : (
                <p className="text-xs text-slate-400 mt-1">* Klik tombol "Lokasi Saya" di peta.</p>
            )}
          </div>

          {/* DESKRIPSI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Deskripsi *</label>
            <textarea
              name="description"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 h-32 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              placeholder="Jelaskan detail kejadian..."
              required
            />
          </div>

          {/* FOTO BUKTI (TAMPILAN BAGUS) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Foto Bukti</label>
            
            {/* Input File (Disembunyikan jika sudah ada foto) */}
            <div className={`relative ${isPhotoReady ? 'hidden' : 'block'}`}>
              <input
                ref={fileInputRef}
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
            </div>

            {/* ERROR MESSAGE FILE */}
            {fileError && (
               <p className="text-xs text-red-600 font-bold mt-1 animate-pulse">{fileError}</p>
            )}

            {/* ✅ KONFIRMASI FOTO SIAP (Hanya Visual) */}
            {isPhotoReady && file && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Foto Siap Upload</span>
                    <span className="text-sm text-slate-600 truncate">{file.name}</span>
                  </div>
                </div>
                
                {/* Tombol Hapus */}
                <button 
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1f6f3f] text-white font-bold py-3 rounded-xl hover:bg-[#185632] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingText}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm font-bold ${
              message.includes("BERHASIL")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}