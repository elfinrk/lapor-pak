import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  // --- DATA ANGGOTA TIM ---
  // Pastikan file foto (misal: elfin.jpg) sudah ada di folder 'public'
  const teamMembers = [
    {
      name: "Elfin", 
      role: "Si Paling Backend 💻",
      desc: "Yang begadang ngurusin database biar gak error pas demo.",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      image: "/elfin.jpg" // <--- Foto asli
    },
    {
      name: "Naura",
      role: "Si Paling UI/UX 🎨",
      desc: "Yang rewel soal warna ijo harus estetik dan pixel perfect.",
      color: "bg-pink-100 text-pink-700 border-pink-200",
      image: "/Naura.jpg" 
    },
    {
      name: "Sahwa",
      role: "Si Paling Laporan 📄",
      desc: "Juru tulis dokumentasi biar tugas besar aman terkendali.",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      image: "/Sahwa.jpg"
      // Jika image dihapus/kosong, otomatis pakai kartun
    },
    {
      name: "Kayla",
      role: "Si Paling Presentasi 🎤",
      desc: "Jago ngeles kalau ditanya dosen pas sidang.",
      color: "bg-purple-100 text-purple-700 border-purple-200",
      image: "/Kayla.jpg"
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fcf9] py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl -z-10 opacity-40 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200 rounded-full blur-3xl -z-10 opacity-40 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16 space-y-6">
          <span className="inline-block bg-green-100 text-[#1f6f3f] px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase border border-green-200 shadow-sm">
            The Dream Team ✨
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Kenalan Yuk Sama <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1f6f3f] to-emerald-500">
              Tim Lapor Pak!
            </span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Pejuang Tugas Besar yang bermimpi dapet nilai A (dan menyelamatkan lingkungan sekalian).
          </p>
        </div>

        {/* --- BAGIAN FOTO GRUP & NARASI --- */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-green-50 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* FOTO TIM */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#1f6f3f] rounded-3xl rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-20 scale-105"></div>
              <div className="relative bg-slate-100 rounded-3xl h-72 md:h-96 w-full overflow-hidden border-[6px] border-white shadow-lg flex items-center justify-center">
                <Image 
                  src="/Berempat.jpg" 
                  alt="Foto Tim Lapor Pak" 
                  fill 
                  className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
              </div>
            </div>

            {/* Narasi Cerita */}
            <div className="space-y-6 text-left">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                🎓 Berawal dari Keprof...
              </h2>
              <div className="text-slate-600 leading-loose space-y-4 text-base">
                <p>
                  Proyek website ini berawal dari pengamatan terhadap lingkungan sekitar. Banyak <strong>permasalahan</strong> yang sebenarnya dekat dengan kehidupan sehari-hari, namun sering terabaikan karena tidak adanya media pengaduan yang mudah diakses dan lebih terstruktur.
                </p>
                <p>
                  Awalnya kami cuma mikir: <em>"Bikin apa ya yang gampang tapi kelihatan canggih biar di-approve dosen?"</em>. Tapi pas dijalani, kami sadar kalau ide ini ternyata berguna beneran buat warga.
                </p>
                <p className="font-medium text-[#1f6f3f]">
                  Jadi, <strong>Lapor Pak!</strong> adalah bukti dedikasi kami. Dari sekadar ngejar nilai, jadi semangat buat bikin lingkungan lebih bersih. (Semoga dosen bangga, ya Pak/Bu! IZINN 🙏)
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-block bg-[#1f6f3f] text-white px-6 py-3 rounded-2xl font-bold -rotate-1 shadow-xl hover:rotate-0 transition-transform cursor-default">
                  #PejuangTugasBesar 🚀
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- KARTU ANGGOTA (GRID) --- */}
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Siapa Aja di Balik Layar?</h2>
            <p className="text-slate-500">Orang-orang hebat (yang kurang tidur)</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-center flex flex-col items-center"
            >
              {/* Avatar Container */}
              <div className="w-28 h-28 bg-slate-50 rounded-full mb-5 overflow-hidden relative border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                
                {/* LOGIKA BARU DISINI: */}
                {/* Cek apakah ada member.image? Kalau ada pakai Image Next.js, kalau tidak pakai DiceBear */}
                {member.image ? (
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}&backgroundColor=b6e3f4`} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                )}
                
              </div>

              <h3 className="font-bold text-xl text-slate-800 mb-1">{member.name}</h3>
              
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 uppercase tracking-wider border ${member.color}`}>
                {member.role}
              </div>
              
              <p className="text-sm text-slate-500 leading-relaxed italic">
                &quot;{member.desc}&quot;
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center pb-12">
            <Link href="/contact" className="group text-[#1f6f3f] font-semibold text-lg inline-flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <span>Punya saran buat tugas kami? Hubungi disini</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
        </div>

      </div>
    </div>
  );
}