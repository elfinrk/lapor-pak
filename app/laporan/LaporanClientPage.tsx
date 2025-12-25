"use client";

import { useState, useRef } from "react";
import { createReportAction } from "@/actions/report.actions";
import dynamic from "next/dynamic";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, MapPin, AlertCircle, CheckCircle2, 
  Trash2, Loader2, Sparkles, Info,
  UploadCloud, FileText, Map as MapIcon, Send, X
} from "lucide-react";

// Lazy loading MapPicker untuk performa
const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 border-2 border-dashed">
      <p className="text-xs">Memuat Peta...</p>
    </div>
  ),
});

export default function LaporanFormClient() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [loadingText, setLoadingText] = useState("Kirim Laporan");
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) return;
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
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    setMessage("");
    setIsSuccess(false);
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const category = formData.get("category");
      const description = formData.get("description");

      if (!category || !description || !selectedLocation) {
        throw new Error("Data belum lengkap.");
      }

      let finalPhotoUrl = "";
      if (file) {
        setLoadingText("Mengompres...");
        const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        
        setUploadProgress(50);
        setLoadingText("Mengunggah...");
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqnkziua0";
        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        uploadData.append("upload_preset", "ml_default");

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST", body: uploadData
        });
        
        if (!cloudinaryRes.ok) throw new Error("Upload gagal.");
        const cloudinaryData = await cloudinaryRes.json();
        finalPhotoUrl = cloudinaryData.secure_url;
        setUploadProgress(80);
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
        setIsSuccess(true);
        setMessage("Laporan berhasil terkirim!");
        formRef.current?.reset();
        setSelectedLocation(null);
        handleRemovePhoto();
      } else {
        throw new Error(res?.message || "Gagal menyimpan.");
      }
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(err.message);
    } finally {
      setIsSubmitting(false);
      setLoadingText("Kirim Laporan");
    }
  };

  const messageTheme = isSuccess 
    ? "bg-green-50 border-green-100 text-green-800" 
    : "bg-red-50 border-red-100 text-red-800";

  return (
    <div className="min-h-screen bg-[#f8faf8] py-6 px-4 relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[20%] bg-green-200 blur-[60px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="bg-white rounded-t-[2rem] p-6 border-b border-slate-100 shadow-sm overflow-hidden">
          {/* Perbaikan: text-[#1f3f2b] agar judul terlihat jelas */}
          <h1 className="text-2xl font-black text-[#1f3f2b] uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="text-green-600" size={24} /> 
            Buat <span className="text-green-600">Laporan</span>
          </h1>
        </div>

        <div className="bg-white rounded-b-[2rem] shadow-xl p-6 space-y-8">
          <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* 1. Kategori */}
            <div className="space-y-3">
              {/* Perbaikan: text-slate-500 agar label terbaca */}
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <FileText size={14} className="text-green-600" /> 1. Kategori
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['lingkungan', 'fasilitas', 'keamanan', 'lainnya'].map((cat) => (
                  <label key={cat} className="cursor-pointer">
                    <input type="radio" name="category" value={cat} className="peer sr-only" required />
                    {/* Perbaikan: text-slate-700 & peer-checked:text-green-800 */}
                    <div className="p-3 text-center rounded-xl border border-slate-200 bg-slate-50 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                      <span className="text-xs font-bold text-slate-700 capitalize peer-checked:text-green-800">{cat}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Lokasi */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <MapIcon size={14} className="text-green-600" /> 2. Titik Lokasi
              </label>
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <MapPicker onLocationSelect={setSelectedLocation} />
              </div>
              {selectedLocation && (
                <div className="text-[10px] bg-green-50 p-2 rounded-lg text-green-800 font-medium border border-green-100">
                  {selectedLocation.address}
                </div>
              )}
            </div>

            {/* 3. Deskripsi - PERBAIKAN UTAMA PADA FONT INPUT */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Info size={14} className="text-green-600" /> 3. Deskripsi
              </label>
              <textarea
                name="description"
                required
                /* text-slate-800 dan placeholder-slate-400 agar tulisan terlihat */
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm h-32 outline-none focus:border-green-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                placeholder="Detail laporan..."
              />
            </div>

            {/* 4. Foto */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Camera size={14} className="text-green-600" /> 4. Lampiran Foto
              </label>
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 cursor-pointer">
                  <UploadCloud size={30} className="text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Ambil Foto</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={previewUrl} className="w-12 h-12 rounded-lg object-cover" alt="preview" />
                    {/* Perbaikan: text-slate-800 */}
                    <span className="text-[10px] font-bold text-slate-800 truncate">{file?.name}</span>
                  </div>
                  <button type="button" onClick={handleRemovePhoto} className="text-red-500 p-2"><Trash2 size={16} /></button>
                </div>
              )}
            </div>

            {isSubmitting && uploadProgress > 0 && (
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1f6f3f] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              {loadingText}
            </button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl text-[10px] font-black border text-center uppercase tracking-widest flex items-center justify-center gap-2 ${messageTheme}`}
              >
                {isSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}