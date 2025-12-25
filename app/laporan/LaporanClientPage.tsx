"use client";

import { useState, useRef } from "react";
import { createReportAction } from "@/actions/report.actions";
import dynamic from "next/dynamic";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, MapPin, AlertCircle, CheckCircle2, 
  ChevronRight, Trash2, Loader2, Sparkles, Info,
  UploadCloud, FileText, Map as MapIcon, Send, X, Lightbulb, Leaf
} from "lucide-react";

// Load MapPicker secara Lazy
const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 animate-pulse border-2 border-dashed border-slate-200">
      <Loader2 className="animate-spin mb-2" />
      <p className="text-sm font-medium tracking-tight">Menyiapkan Peta Satelit...</p>
    </div>
  ),
});

export default function LaporanFormClient() {
  const [message, setMessage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [loadingText, setLoadingText] = useState("Kirim Laporan");
  const [showGuide, setShowGuide] = useState(false); 
  
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFileError("");
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setFileError("⚠️ File harus berupa gambar.");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemovePhoto = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMessage("");
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const category = formData.get("category");
      const description = formData.get("description");

      if (!category || !description || !selectedLocation) {
        throw new Error("Harap lengkapi semua data dan lokasi.");
      }

      let finalPhotoUrl = "";
      if (file) {
        setLoadingText("Mengompres...");
        setUploadProgress(30);
        const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);

        setLoadingText("Mengunggah...");
        setUploadProgress(60);
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqnkziua0";
        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        uploadData.append("upload_preset", "ml_default");

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST", body: uploadData
        });
        
        if (!cloudinaryRes.ok) throw new Error("Gagal upload ke cloud.");
        const cloudinaryData = await cloudinaryRes.json();
        finalPhotoUrl = cloudinaryData.secure_url;
        setUploadProgress(90);
      }

      setLoadingText("Menyimpan...");
      const dataToSend = new FormData();
      dataToSend.append("category", category as string);
      dataToSend.append("description", description as string);
      dataToSend.append("location", selectedLocation.address);
      dataToSend.append("latitude", selectedLocation.lat.toString());
      dataToSend.append("longitude", selectedLocation.lng.toString());
      dataToSend.append("photoUrl", finalPhotoUrl);

      const res = await createReportAction(dataToSend);
      if (res?.success) {
        setUploadProgress(100);
        setMessage("✅ BERHASIL! Laporan telah dikirim.");
        formRef.current?.reset();
        setSelectedLocation(null);
        handleRemovePhoto();
      } else {
        throw new Error(res?.message || "Gagal menyimpan laporan.");
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
      setLoadingText("Kirim Laporan");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f1] py-12 px-4 relative overflow-hidden selection:bg-green-200 font-sans">
      
      {/* --- DEKORASI BACKGROUND (Agar tidak boring) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-green-200/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-[35rem] h-[35rem] bg-emerald-200/20 rounded-full blur-[100px]" 
        />

        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[10%] left-[15%] text-green-600/20"
        >
          <Leaf size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] right-[10%] text-green-600/20"
        >
          <MapIcon size={150} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto relative z-10"
      >
        {/* HEADER */}
        <div className="bg-white rounded-t-[3rem] p-10 border-b border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
            <Sparkles size={180} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-black text-[#1f3f2b] tracking-tighter uppercase leading-none">
            BUAT <span className="text-green-600">LAPORAN</span>
          </h1>
          <p className="text-slate-500 font-medium italic mt-2 text-sm leading-relaxed max-w-xs">
            Suaramu adalah awal dari perubahan lingkungan yang lebih asri.
          </p>
        </div>

        {/* FORM BODY (Glassmorphism) */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-b-[3rem] shadow-2xl p-8 md:p-12 space-y-10 border-x border-b border-white">
          
          {/* TIPS PANEL */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-5 flex items-start gap-5 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
              <Lightbulb size={60} />
            </div>
            <div className="bg-orange-500 text-white p-3 rounded-2xl shadow-lg shadow-orange-200 shrink-0">
              <Info size={20} />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-1">Agar Laporan Cepat Diproses:</h4>
              <ul className="text-[11px] text-orange-700/80 space-y-1 font-bold">
                <li>✨ Ambil foto dari jarak yang ideal (tidak terlalu jauh/dekat).</li>
                <li>📍 Pastikan GPS aktif saat menandai lokasi peta.</li>
                <li>✍️ Sebutkan ciri khas lokasi (misal: "Dekat gapura merah").</li>
              </ul>
            </div>
          </motion.div>

          <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-10">
            {/* 1. KATEGORI */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <FileText size={16} className="text-green-600" /> 1. Pilih Kategori Masalah
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['lingkungan', 'fasilitas', 'keamanan', 'lainnya'].map((cat) => (
                  <label key={cat} className="cursor-pointer group">
                    <input type="radio" name="category" value={cat} className="peer sr-only" required />
                    <div className="p-4 text-center rounded-2xl border-2 border-slate-50 bg-white/50 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all group-hover:bg-white shadow-sm">
                      <span className="text-sm font-bold text-slate-600 capitalize peer-checked:text-green-700">{cat}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. LOKASI */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <MapIcon size={16} className="text-green-600" /> 2. Tentukan Titik Lokasi
              </label>
              <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl ring-1 ring-slate-100 group">
                <MapPicker onLocationSelect={setSelectedLocation} />
              </div>
              <AnimatePresence>
                {selectedLocation && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-green-50 p-4 rounded-2xl border border-green-100 flex gap-3">
                    <MapPin className="text-green-600 shrink-0" size={18} />
                    <p className="text-xs text-green-800 font-bold leading-relaxed">{selectedLocation.address}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. DESKRIPSI */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                <Info size={16} className="text-green-600" /> 3. Deskripsi & Patokan Gedung
              </label>
              <textarea
                name="description"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-[2rem] px-6 py-6 text-slate-700 h-40 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                placeholder="Contoh: Ada sampah menumpuk di depan Indomaret Buah Batu yang mulai berbau..."
              />
            </div>

            {/* 4. FOTO BUKTI */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  <Camera size={16} className="text-green-600" /> 4. Lampiran Foto Bukti
                </label>
                <button type="button" onClick={() => setShowGuide(true)} className="text-[10px] font-black text-green-600 hover:underline uppercase tracking-widest">
                  Lihat Panduan Foto
                </button>
              </div>
              
              <div className="relative group">
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-green-50 hover:border-green-300 transition-all cursor-pointer">
                    <UploadCloud size={40} className="text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-400 tracking-tight">Ketuk untuk Mengambil Foto</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                          <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-black text-slate-700 truncate max-w-[150px]">{file?.name}</p>
                          <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Foto Siap Kirim</p>
                        </div>
                      </div>
                      <button type="button" onClick={handleRemovePhoto} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* PROGRESS BAR */}
                    {isSubmitting && (
                      <div className="space-y-2 px-2 pb-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          <span>{loadingText}</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1f6f3f] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-green-900/30 hover:bg-[#185632] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 tracking-[0.3em] uppercase text-sm"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {loadingText}
            </button>
          </form>

          {/* MESSAGE TOAST */}
          <AnimatePresence>
            {message && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`p-6 rounded-3xl flex items-center gap-3 font-bold text-sm border shadow-sm ${
                  message.includes("BERHASIL") ? "bg-green-50 text-green-800 border-green-100" : "bg-red-50 text-red-800 border-red-100"
                }`}>
                {message.includes("✅") ? <CheckCircle2 /> : <AlertCircle />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- MODAL PANDUAN FOTO --- */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGuide(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] p-10 max-w-lg w-full relative z-10 shadow-2xl text-center">
              <button onClick={() => setShowGuide(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-800"><X size={20} /></button>
              <div className="bg-green-100 text-green-600 p-4 rounded-3xl inline-block mb-6 shadow-inner"><Camera size={32} /></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Panduan Pengambilan Foto</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">Foto yang jelas mempercepat petugas dalam proses verifikasi.</p>
              <div className="space-y-4 text-left">
                {[
                  { t: "Fokus & Jelas", d: "Pastikan foto tidak goyang (blur) dan objek terlihat nyata." },
                  { t: "Cukup Cahaya", d: "Ambil foto saat terang atau gunakan flash jika di area gelap." },
                  { t: "Tunjukkan Lokasi", d: "Usahakan foto memperlihatkan landmark atau patokan sekitar." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-green-50/50">
                    <div className="text-green-600 font-black text-lg">0{i+1}</div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.t}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowGuide(false)} className="mt-8 w-full py-4 bg-green-600 text-white rounded-2xl font-black tracking-widest uppercase shadow-lg shadow-green-100 transition-transform active:scale-95">Saya Mengerti</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}