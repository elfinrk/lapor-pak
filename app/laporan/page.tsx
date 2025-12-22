"use client";
import { useState, useRef } from "react";
import { createReportAction } from "@/actions/report.actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#1f6f3f] text-white font-bold py-3 rounded-xl hover:bg-[#185632] transition-all disabled:opacity-70"
    >
      {pending ? "Mengirim..." : "Kirim Laporan"}
    </button>
  );
}

export default function LaporanPage() {
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (formData: FormData) => {
    setMessage("");

    try {
      // --- VALIDASI FIELD WAJIB ---
      const category = formData.get("category");
      const location = formData.get("location");
      const description = formData.get("description");

      if (!category || !location || !description) {
        setMessage("Harap isi semua field wajib.");
        return;
      }

      // --- VALIDASI FILE (BIAR MOBILE AMAN) ---
      const file = formData.get("photo");
      if (file instanceof File && file.size > 0) {
        const maxMB = 5;
        const maxBytes = maxMB * 1024 * 1024;

        if (file.size > maxBytes) {
          setMessage(`Foto terlalu besar. Maksimal ${maxMB}MB ya.`);
          return;
        }

        // Kadang ada device yang ngirim file.type kosong, jadi ceknya santai
        if (file.type && !file.type.startsWith("image/")) {
          setMessage("File harus berupa gambar.");
          return;
        }
      }

      const res = await createReportAction(formData);

      setMessage(res?.message ?? "Terjadi kesalahan. Coba lagi.");
      if (res?.success) formRef.current?.reset();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      setMessage("Gagal mengirim laporan. Coba lagi ya.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-green-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Buat Laporan</h1>
        <p className="text-slate-500 mb-6">
          Sampaikan masalah lingkungan di sekitarmu.
        </p>

        <form ref={formRef} action={handleFormSubmit} className="space-y-5">
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
              <option value="" disabled>
                Pilih Kategori...
              </option>
              <option value="lingkungan">Lingkungan</option>
              <option value="fasilitas">Fasilitas Umum</option>
              <option value="keamanan">Keamanan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Contoh: Jl. Mawar No. 5"
              required
            />
          </div>

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

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Foto Bukti
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <SubmitButton />
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
              message.toLowerCase().includes("berhasil")
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
