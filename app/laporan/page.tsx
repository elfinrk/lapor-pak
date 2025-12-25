"use client";

import { useState, useRef, useEffect } from "react";
import { createReportAction } from "@/actions/report.actions";
import dynamic from "next/dynamic";

// Load MapPicker secara Lazy
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 animate-pulse">
      <p>Memuat Peta...</p>
    </div>
  ),
});

export default function LaporanPage() {
  const [message, setMessage] = useState("");
  
  // State Lokasi
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // State Submit Utama
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainProgress, setMainProgress] = useState(0);

  // --- STATE KHUSUS FOTO ---
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [photoProgress, setPhotoProgress] = useState(0); // 0 - 100
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false); // Penanda foto "selesai"

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Batas Ukuran File (4.5 MB)
  const MAX_MB = 4.5;
  const MAX_BYTES = MAX_MB * 1024 * 1024;

  // --- LOGIC PROGRESS BAR UTAMA (SUBMIT) ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      setMainProgress(10);
      interval = setInterval(() => {
        setMainProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);
    } else {
      setMainProgress(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  // --- HANDLE FILE CHANGE (SIMULASI UPLOAD) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    // Reset state foto
    setFile(null);
    setFileError("");
    setPhotoProgress(0);
    setIsPhotoUploaded(false);

    if (selectedFile) {
      // 1. Validasi Ukuran
      if (selectedFile.size > MAX_BYTES) {
        setFileError(`⚠️ File terlalu besar. Maksimal ${MAX_MB} MB.`);
        event.target.value = ""; // Reset input
        return;
      }
      // 2. Validasi Tipe
      if (!selectedFile.type.startsWith("image/")) {
        setFileError("⚠️ File harus berupa gambar.");
        event.target.value = "";
        return;
      }

      // 3. JALANKAN SIMULASI UPLOAD FOTO
      setFile(selectedFile);
      
      // Timer untuk efek visual "Uploading..."
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += 20; // Tambah 20% setiap interval
        setPhotoProgress(progress);

        if (progress >= 100) {
          clearInterval(uploadInterval);
          setIsPhotoUploaded(true); // SELESAI!
        }
      }, 150); // Kecepatan animasi upload
    }
  };

  // --- HANDLE HAPUS FOTO ---
  const handleRemovePhoto = () => {
    setFile(null);
    setPhotoProgress(0);
    setIsPhotoUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- HANDLE SUBMIT FORM ---
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMessage("");
    setIsSubmitting(true);

    try {
      // Validasi Manual
      const category = formData.get("category");
      const description = formData.get("description");

      if (!category || !description) {
        setMessage("Harap isi kategori dan deskripsi.");
        setIsSubmitting(false);
        return;
      }

      if (!selectedLocation) {
        setMessage("Harap pilih titik lokasi pada peta.");
        setIsSubmitting(false);
        return;
      }
      
      // Tambahan data Map
      formData.set("location", selectedLocation.address);
      formData.append("latitude", selectedLocation.lat.toString());
      formData.append("longitude", selectedLocation.lng.toString());

      // KIRIM KE SERVER
      const res = await createReportAction(formData);

      setMainProgress(100);

      setTimeout(() => {
        setMessage(res?.message ?? "Terjadi kesalahan.");
        setIsSubmitting(false);
        
        if (res?.success) {
          formRef.current?.reset();
          setSelectedLocation(null);
          setMainProgress(0);
          handleRemovePhoto(); // Reset foto juga
        }
      }, 800);

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      setMessage("Gagal mengirim laporan. Cek koneksi internet.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Buat Laporan</h1>
        <p className="text-slate-500 mb-6">
          Sampaikan masalah lingkungan di sekitarmu.
        </p>

        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Kategori <span className="text-red-500">*</span>
            </label>
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
            <label className="text-sm font-semibold text-slate-700">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
                <MapPicker onLocationSelect={setSelectedLocation} />
            </div>
            {selectedLocation ? (
                <p className="text-xs text-green-700 mt-1 bg-green-50 p-2 rounded border border-green-100">
                    📍 <strong>Lokasi Terpilih:</strong> {selectedLocation.address}
                </p>
            ) : (
                <p className="text-xs text-slate-400 mt-1">
                    * Klik tombol "Lokasi Saya" di peta atau klik manual.
                </p>
            )}
          </div>

          {/* DESKRIPSI */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 h-32 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              placeholder="Jelaskan detail kejadian..."
              required
            />
          </div>

          {/* --- FOTO BUKTI DENGAN KONFIRMASI UPLOAD --- */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Foto Bukti
            </label>
            
            {/* Input File (Disembunyikan jika sudah ada foto) */}
            <div className={`relative ${isPhotoUploaded ? 'hidden' : 'block'}`}>
              <input
                ref={fileInputRef}
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                disabled={photoProgress > 0 && photoProgress < 100} // Disable saat sedang loading
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
            </div>

            {/* PROGRESS BAR KHUSUS FOTO */}
            {photoProgress > 0 && !isPhotoUploaded && (
               <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                 <div 
                   className="bg-blue-500 h-1.5 rounded-full transition-all duration-100" 
                   style={{ width: `${photoProgress}%` }}
                 ></div>
                 <p className="text-[10px] text-blue-500 mt-1 text-right">Memuat foto... {photoProgress}%</p>
               </div>
            )}

            {/* ERROR MESSAGE */}
            {fileError && (
               <p className="text-xs text-red-600 font-bold mt-1 animate-pulse">{fileError}</p>
            )}

            {/* ✅ KONFIRMASI FOTO SELESAI TERUPLOAD */}
            {isPhotoUploaded && file && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Foto Berhasil Dimuat</span>
                    <span className="text-sm text-slate-600 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
                
                {/* Tombol Hapus / Ganti Foto */}
                <button 
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-red-400 hover:text-red-600 p-1 transition-colors"
                  title="Hapus foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* PROGRESS BAR UTAMA (SAAT KLIK KIRIM) */}
          {isSubmitting && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${mainProgress}%` }}
              ></div>
              <p className="text-xs text-center text-slate-500 mt-1">
                Mengirim Data Laporan... {mainProgress}%
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (photoProgress > 0 && !isPhotoUploaded)} // Cegah kirim kalau foto belum 'selesai'
            className="w-full bg-[#1f6f3f] text-white font-bold py-3 rounded-xl hover:bg-[#185632] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sedang Memproses..." : "Kirim Laporan"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
              message.toLowerCase().includes("berhasil") || message.toLowerCase().includes("sukses")
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