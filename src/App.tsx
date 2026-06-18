import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Palette,
  CheckCircle,
  HelpCircle,
  BookOpen,
  MessageSquare,
  FileCode,
  Tv,
  Calendar as CalendarIcon,
  Filter,
  Layers,
  Database,
  BarChart,
  UserCheck,
  Send,
  Download,
  Plus,
  Trash,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Video,
  FileText
} from "lucide-react";
import { Client, BrandingResult, LogoResult, ContentResult, FunnelResult, SaaS_Deliverables } from "./types";

export default function App() {
  // Roles & Multi-tenant settings
  const [currentRole, setCurrentRole] = useState<"client" | "admin" | "super_admin">("client");
  const [selectedPackage, setSelectedPackage] = useState<"starter" | "basic" | "professional" | "business">("professional");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Client states
  const [clientData, setClientData] = useState({
    namaBisnis: "Kopi Lestari Mandiri",
    namaPribadi: "Ahmad Wijaya",
    bidangUsaha: "F&B / Coffee Shop & Roastery",
    targetPasar: "Milenial & Pekerja Kantoran Pecinta Kopi Lokal Premium",
    lokasiUsaha: "Bandung, Jawa Barat",
    whatsapp: "081234567890",
    email: "kontak@kopilestari.com",
    website: "www.kopilestarimandiri.id"
  });

  // Dynamic Generator Results
  const [brandingResult, setBrandingResult] = useState<BrandingResult | null>(null);
  const [logoResult, setLogoResult] = useState<LogoResult | null>(null);
  const [contentResult, setContentResult] = useState<ContentResult | null>(null);
  const [funnelResult, setFunnelResult] = useState<FunnelResult | null>(null);

  // CRM state
  const [crmClients, setCrmClients] = useState<Client[]>([]);
  const [searchCrmQuery, setSearchCrmQuery] = useState("");
  const [crmForm, setCrmForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    status: "Lead" as any,
    segment: "F&B",
    location: "Jakarta",
    notes: ""
  });
  const [selectedCrmClient, setSelectedCrmClient] = useState<Client | null>(null);

  // Content calendar schedules
  const [calendarItems, setCalendarItems] = useState([
    { id: 1, day: "Senin", type: "Instagram Feed", topic: "Edukasi proses roasting kopi arabika", time: "09:00", status: "Published" },
    { id: 2, day: "Selasa", type: "TikTok Video", topic: "Bloopers barista bikin latte art gagal", time: "15:00", status: "Planned" },
    { id: 3, day: "Rabu", type: "WhatsApp Broadcast", topic: "Promo diskon 20% khusus tengah minggu", time: "11:00", status: "Planned" },
    { id: 4, day: "Kamis", type: "Blog Article", topic: "Manfaat kesehatan minum kopi tanpa gula", time: "10:30", status: "Planned" },
    { id: 5, day: "Jumat", type: "Instagram Story", topic: "Q&A interaktif bareng roaster kopi Lestari", time: "16:00", status: "Planned" }
  ]);

  // Loading statuses
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingFunnel, setLoadingFunnel] = useState(false);
  const [apiOk, setApiOk] = useState(true);

  // Social Media accounts checklist
  const [socialChecklist, setSocialChecklist] = useState({
    fbPage: false,
    igBusiness: false,
    tiktokBusiness: false,
    youtubeChannel: false,
    linkedinPage: false,
    gbp: false
  });

  // AI Content Writer choices
  const [contentPlatform, setContentPlatform] = useState("Instagram Post");
  const [contentTopic, setContentTopic] = useState("Cara memilih biji kopi segar berkualitas");
  const [contentTone, setContentTone] = useState("Inspiratif");
  const [contentKeywords, setContentKeywords] = useState("Kopi Bandung, Kopi Organik, Asli Nusantara");

  // Poster Editor states
  const [posterText, setPosterText] = useState("PROMO KAFFEINE SPECIAL!");
  const [posterSubtext, setPosterSubtext] = useState("Diskon 25% setiap pembelian manual brew");
  const [posterSize, setPosterSize] = useState("1080x1080");
  const [posterColor, setPosterColor] = useState("#D4AF37");

  // Video Script state & timer simulator
  const [videoScriptInput, setVideoScriptInput] = useState("Cara menyeduh kopi V60 di rumah dengan rasa kafe");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoSec, setVideoSec] = useState(0);

  // WhatsApp broadcast states
  const [waMessageText, setWaMessageText] = useState("Halo Kak! Ada salam hangat dari Kopi Lestari Mandiri. Silakan dapatkan voucher buy 1 get 1 free di website kami.");
  const [waConsoleLogs, setWaConsoleLogs] = useState<string[]>([
    "WA Automation Module Ready...",
    "[SYSTEM] WhatsApp instance initialized automatically on background."
  ]);
  const [chatbotFaqs, setChatbotFaqs] = useState([
    { keyword: "halo", reply: "Halo! Terima kasih telah menghubungi Customer Care kami. Ada yang bisa kami bantu seputar pesanan Anda?" },
    { keyword: "harga", reply: "Paket biji kopi kami mulai dari Rp 45.000 (kemasan 250gr). Detail lengkap cek di website kami." },
    { keyword: "lokasi", reply: "Kami berlokasi di Jl. Merdeka No. 12, Kota Bandung. Silakan mampir kak!" }
  ]);
  const [newChatbotKeyword, setNewChatbotKeyword] = useState("");
  const [newChatbotReply, setNewChatbotReply] = useState("");

  // Load CRM clients on mount
  useEffect(() => {
    fetchCrmClients();
  }, []);

  // Simulating video frame counts
  useEffect(() => {
    let interval: any = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoSec(prev => (prev >= 4 ? 0 : prev + 1));
      }, 3000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const fetchCrmClients = async () => {
    try {
      const res = await fetch("/api/crm/clients");
      if (res.ok) {
        const data = await res.json();
        setCrmClients(data);
      }
    } catch (e) {
      console.error(e);
      setApiOk(false);
    }
  };

  const handleGenerateBranding = async () => {
    setLoadingBrand(true);
    try {
      const res = await fetch("/api/generate-branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData)
      });
      if (res.ok) {
        const data = await res.json();
        setBrandingResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBrand(false);
    }
  };

  const handleGenerateLogo = async () => {
    setLoadingLogo(true);
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaBisnis: clientData.namaBisnis,
          sloganUtama: brandingResult?.slogan[0] || "Asli Kopi Nusantara",
          warnaDominan: "Navy & Gold"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLogoResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogo(false);
    }
  };

  const handleGenerateContent = async () => {
    setLoadingContent(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: contentPlatform,
          bidangUsaha: clientData.bidangUsaha,
          topik: contentTopic,
          gayaBahasa: contentTone,
          kataKunci: contentKeywords
        })
      });
      if (res.ok) {
        const data = await res.json();
        setContentResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleGenerateFunnel = async () => {
    setLoadingFunnel(true);
    try {
      const res = await fetch("/api/generate-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaBisnis: clientData.namaBisnis,
          bidangUsaha: clientData.bidangUsaha,
          targetPasar: clientData.targetPasar,
          leadMagnetType: "E-book & Checklist Gratis"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFunnelResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFunnel(false);
    }
  };

  const handleSaveClientCrm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmForm.name || !crmForm.business) return;

    try {
      const url = selectedCrmClient ? `/api/crm/clients/${selectedCrmClient.id}` : "/api/crm/clients";
      const method = selectedCrmClient ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crmForm)
      });
      if (res.ok) {
        fetchCrmClients();
        setCrmForm({ name: "", business: "", email: "", phone: "", status: "Lead", segment: "F&B", location: "Jakarta", notes: "" });
        setSelectedCrmClient(null);
      }
    } catch (error) {
      console.error("Gagal menyimpan client", error);
    }
  };

  const handleDeleteCrm = async (id: string) => {
    if (!confirm("Hapus klien ini dari database CRM?")) return;
    try {
      const res = await fetch(`/api/crm/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCrmClients();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const triggerWaBroadcast = () => {
    setWaConsoleLogs(prev => [
      ...prev,
      `[BROADCAST] Memulai pengiriman siaran ke ${crmClients.length} kontak...`,
      ...crmClients.map(c => `[KIRIM] Berhasil terkirim via API ke ${c.name} (${c.phone})`),
      `[BROADCAST] Selesai. Pengiriman berhasil 100% tanpa hambatan.`
    ]);
  };

  // Setup basic mock outcomes as helper if not yet clicked
  useEffect(() => {
    if (!brandingResult) {
      // pre-populate on start to make interface interactive immediately
      setBrandingResult({
        suggestedBrandNames: [
          { name: "Kopi Lestari Roastery", philosophy: "Memadukan kelestarian perkebunan lokal dengan kesegaran roasting modern." },
          { name: "Aroma Mandiri Co.", philosophy: "Mencerminkan etos kemandirian petani luhur bermutu tinggi." },
          { name: "Lestari Brew Lab", philosophy: "Inovasi rasa canggih dengan standar kualitas barista internasional." }
        ],
        slogan: [
          "Cita Rasa Luhur dari Bumi Nusantara",
          "Koneksi Setiap Cangkir Penambah Inspirasi",
          "Kopi Jujur untuk Jiwa yang Mandiri"
        ],
        businessDescription: "Kopi Lestari Mandiri berkomitmen mendekatkan cita rasa biji kopi arabika pilihan Jawa Barat kepada pecinta kopi milenial di Bandung. Dengan pengerjaan modern roastery yang presisi, setiap cangkir kopi menumbuhkan kemitraan adil bersama petani lokal serta mengedepankan kualitas rasa autentik berkualitas premium.",
        valueProposition: "Hadir sebagai sahabat roastery andalan dengan jaminan kesegaran kopi 100% organik, proses roasting presisi bersertifikat, dan harga bersahabat langsung dari sumbernya.",
        socialMediaBio: {
          instagram: "✨ Aroma kopi nusantara asli Bandung berkualitas premium.\n🌿 100% Biji Organik pilihan petani mandiri.\n☕ Seduh hangat inspirasimu hari ini!\n👉 Pesan Kilat WA: 081234567890",
          tiktok: "Barista Hacks & tips seduh ala cafe rumahan! ☕✨\n💯 Roasted Fresh Daily\n📍 Bandung, West Java\n👇 Promo V60 Hari Ini 👇",
          linkedin: "Kopi Lestari Mandiri adalah korporasi pangan penyedia biji kopi arabika robusta pilihan komoditas unggulan Jawa Barat. Menyediakan supply chain rantai pasokan tepercaya untuk industri perhotelan dan kafe lokal."
        },
        corporateProfile: "Didirikan di Bandung Jawa Barat, Kopi Lestari Mandiri membawa misi membangkitkan kedaulaan komunitas kopi lokal melalui digitalisasi branding modern. Menyajikan proses pasca-panen tepercaya, mengemas mutu pengerjaan konsisten, dan melayani pendistribusian cepat ke seluruh pelosok tanah air.",
        companyOverview: "Visi:\nMenjadi roastery kopi lokal nomor satu dengan kemitraan petani mandiri terluas serta inovasi kemasan berstandar ramah lingkungan di Indonesia.\n\nMisi:\n1. Menyediakan biji kopi organik bermutu premium terkontrol.\n2. Mengedukasi UMKM kuliner tentang standarisasi rasa kopi.\n3. Memberikan akses pemasaran digital bagi petani lokal.",
        elevatorPitch: "Halo! Saya Ahmad Wijaya dari Kopi Lestari Mandiri. Kami membantu kedai kopi lokal mendapatkan biji roasting presisi tanpa fluktuasi rasa. Melalui platform digital branding terpadu kami menaikkan repeat order kedai kopi hingga 35%. Mari kita seduh masa depan kopi nusantara bersama!"
      });
    }

    if (!logoResult) {
      setLogoResult({
        hexPalette: ["#020617", "#D4AF37", "#f3f4f6", "#1e293b"],
        suggestionConcept: "Lencana geometris melingkar memadukan biji kopi premium dan mahkota keemasan yang melambangkan reputasi mutu kualitas berkelas tertinggi di pasaran.",
        recommendedTypography: {
          headingFont: "Space Grotesk - Bold 800",
          bodyFont: "Inter - Medium 400",
          description: "Space Grotesk memberikan aksentuasi kokoh modern untuk display headline, dikombinasikan dengan Inter untuk kejelasan pembacaan pada teks panjang di handphone."
        },
        logoAssetsDescription: "Ikon minimalis berupa gabungan inisial huruf K melingkar dibalut garis siluet cangkir estetik berwarna emas murni."
      });
    }

    if (!contentResult) {
      setContentResult({
        recommendedTitle: "3 Rahasia Barista Sukses Bikin Kopi Wangi Tanpa Bahan Pengawet!",
        primaryHook: "Pernah menyeduh kopi tapi aromanya cepat hilang begitu saja? Ini dia trik barista tersembunyi yang jarang dibagikan!",
        bodyText: "Semuanya berawal dari cara Anda menyimpan biji kopi itu sendiri. Pastikan menggunakan wadah tertutup kedap udara yang memiliki valve satu arah (one-way degas valve). Hindari menyimpan kopi di dalam kulkas karena berisiko merusak struktur minyak esensial yang menghasilkan rasa autentik aromatik.",
        scriptDialogLines: [
          { scene: "Scene 1 (Hook)", visual: "Barista menuangkan air panas ke bubuk kopi, blooming mekar indah berbusa keemasan.", audio: "Ini rahasia kenapa kopi kafe aromanya wangi semerbak!" },
          { scene: "Scene 2 (Problem)", visual: "Tangan memegang stoples kopi kaca biasa yang longgar, kopinya berdebu.", audio: "Stoples kaca biasa bikin udara masuk dan merusak minyak kopi dalam waktu 3 hari!" },
          { scene: "Scene 3 (Solution)", visual: "Menunjukkan stoples kedap udara Lestari vacuum dengan seal karet tebal.", audio: "Solusinya, selalu simpan biji kopi Anda di wadah kedap khusus dengan degassing valve premium." }
        ],
        hashtags: ["#KopiNusantara", "#BaristaHacks", "#KopiLestari", "#TipsNgopi", "#RoasteryBandung"]
      });
    }

    if (!funnelResult) {
      setFunnelResult({
        landingPageHeadline: "Dapatkan Rahasia Bisnis Coffee Shop Laris Konsisten Tanpa Bergantung Iklan Berbayar!",
        leadMagnetTitle: "Panduan PDF: 5 Langkah Membuka Kedai Kopi Minimalis Hasil Menjanjikan dari Garasi Rumah.",
        emailSequence: [
          { subject: "💌 Selamat datang! Ini buku panduan menyeduh impian Anda.", content: "Halo pecinta kopi! Senang berkenalan dengan Anda. Silakan unduh materi panduan spesial yang telah kami racik dari resep sukses roastery kami.", delayInDays: 0 },
          { subject: "💡 Bagaimana Kopi Lestari Menghemat 30% Biaya Supply Chain?", content: "Halo rekan kopi! Di email kedua ini, kita akan mempelajari taktik menghemat modal tanpa mengorbankan kepuasan lidah pelanggan.", delayInDays: 2 }
        ],
        whatsappSequence: [
          { tag: "Sambutan Otomatis", message: "Halo Kak! Ini asisten otomatis *Kopi Lestari*. File e-book siap diunduh gratis melalui link: _bit.ly/panduan-lestari-roast_" },
          { tag: "Hari Ke-2 Hubungi Kembali", message: "Pagi kak! Bagaimana draf panduannya? Kebetulan minggu ini kami menyaring 3 mitra baru untuk diskon supply arabika premium." }
        ],
        salesFunnelStages: {
          awareness: "Mendatangkan traffic lokal lewat konten resep barista viral di Instagram dan TikTok reels.",
          interest: "Menyediakan ebook gratis seputar kalkulasi modal coffeeshop di halaman landing page.",
          decision: "Mengirimkan sampel biji kopi arabika mini spesial langsung ke alamat para pemilik kedai kopi partner prospek.",
          action: "Menawari langganan tetap paket kopi roastery bulanan dengan diskon 25%."
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* LEFT SIDEBAR: NAVIGATION RAIL - SOPHISTICATED DARK & GOLD ACCENT */}
      <aside className="w-full md:w-64 bg-[#090d1f] border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#aa8822] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/10 animate-pulse">
            <span className="text-[#020617] font-bold text-lg font-serif">AB</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">ABDI AUTOMATION</h2>
            <p className="text-[10px] text-[#D4AF37] tracking-wider uppercase font-medium">Digital Automation</p>
          </div>
        </div>

        {/* CURRENT ROLE SWITCHER & PACKAGE SELECTOR */}
        <div className="p-4 mx-3 my-4 bg-slate-900/90 rounded-xl border border-slate-800">
          <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block mb-1">
            AKSES & PERAN HIERARKI
          </label>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as any)}
            className="w-full text-xs font-semibold bg-slate-950 border border-[#D4AF37]/35 rounded p-1.5 p-y-2 text-white outline-none cursor-pointer focus:border-[#D4AF37]"
          >
            <option value="client">Client (Pemilik Brand)</option>
            <option value="admin">Admin (Kelola Pelanggan)</option>
            <option value="super_admin">Super Admin (Akses Penuh)</option>
          </select>

          {/* Package details */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-500 uppercase block">PAKET AKTIF</span>
              <span className="text-xs text-[#D4AF37] font-bold uppercase">{selectedPackage}</span>
            </div>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value as any)}
              className="bg-slate-950 text-[10px] border border-slate-800 text-slate-300 rounded p-1"
            >
              <option value="starter">Starter (100rb)</option>
              <option value="basic">Basic (200rb)</option>
              <option value="professional">Pro (300rb)</option>
              <option value="business">Business (500rb)</option>
            </select>
          </div>
        </div>

        {/* NAV LIST */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            BRAND BUILDER PILOT
          </p>
          {[
            { id: "dashboard", label: "Dashboard Overview", icon: BarChart },
            { id: "branding", label: "1. Brand Generator", icon: Sparkles },
            { id: "logo", label: "2. Logo & Brand Kit", icon: Palette },
            { id: "social", label: "3. Social Setup Asst.", icon: CheckCircle },
            { id: "content", label: "4. AI Content Writer", icon: Sliders },
            { id: "poster", label: "5. AI Poster Creator", icon: Layers },
            { id: "video", label: "6. AI Video Storyboard", icon: Video },
            { id: "calendar", label: "7. Content Calendar", icon: CalendarIcon },
            { id: "funnel", label: "8. Marketing Funnel", icon: Filter },
            { id: "whatsapp", label: "9. WA Auto Reply", icon: MessageSquare },
            { id: "crm", label: "10. CRM Database", icon: Database },
            { id: "blueprints", label: "11. SaaS Blueprints & Manual", icon: FileText }
          ].map((nav) => {
            const Icon = nav.icon;
            const isSelected = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                  isSelected
                    ? "bg-[#D4AF37]/15 text-white border-l-4 border-[#D4AF37]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#D4AF37]" : "text-slate-500"}`} />
                {nav.label}
              </button>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 mt-auto text-xs text-center text-slate-600">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Konektivitas</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
            <span className="text-slate-400 font-medium">Sistem Server Online</span>
          </div>
          <span className="text-[9px] block text-slate-500 italic mt-2">Versi 2.4.0 (Aman & Stabil)</span>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-hidden">
        
        {/* Abstract Golden Highlight Ambient BG lights */}
        <div className="absolute top-[-250px] right-[-250px] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* MAIN TOP BAR */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-slate-800/80 bg-[#020617]/85 backdrop-blur-xl z-20 sticky top-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 tracking-wide font-bold">
                SaaS PORTAL
              </span>
              {currentRole === "super_admin" && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/30 font-bold uppercase">
                  Super Admin Mode
                </span>
              )}
              {currentRole === "admin" && (
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/40 font-bold uppercase">
                  Admin Mode
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-2xl font-bold font-serif text-white tracking-tight mt-1">
              ABDI AUTOMATION
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulation of tokens */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono text-slate-400">🔥 Unlimited SaaS Mode</span>
            </div>

            {/* Quick manual download call sheet */}
            <button
              onClick={() => setActiveTab("blueprints")}
              className="bg-gradient-to-r from-[#D4AF37] to-[#b19020] text-[#020617] font-semibold text-xs px-4 py-2 rounded-lg hover:brightness-110 shadow-lg shadow-[#D4AF37]/10 transition-all font-mono"
            >
              Export Manual
            </button>
          </div>
        </header>

        {/* LIVE WORKSPACE CONTENT */}
        <section className="flex-1 p-4 md:p-8 z-10 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* HEADING PROMO IN INDONESIAN */}
              <div className="bg-gradient-to-r from-slate-900 via-[#0a142c] to-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 h-full opacity-10 flex items-center font-serif text-8xl text-[#D4AF37]">
                  UMKM
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Selamat Datang di Hub Identitas Digital Premium Anda!
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-4">
                    Sistem SaaS multifungsi kami dirancang khusus membantu UMKM, freelancer, agency, dan professional mempercepat pembuatan profil usaha, logo berkualitas, content marketing multiplatform, hingga WhatsApp automation & CRM database terpadu.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 rounded-full font-mono">
                      🚀 Kopi Lestari Mandiri didaftarkan sebagai Identitas Utama
                    </span>
                    <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-mono">
                      🔐 Keamanan SSL & Google API Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* CRM STATE KEY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">
                    <span>Total Database CRM</span>
                    <Database className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-3xl font-extrabold text-white font-mono">{crmClients.length}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block">Sinkronisasi Server Express Aktif</span>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">
                    <span>Schedules Terencana</span>
                    <CalendarIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white font-mono">{calendarItems.length}</p>
                  <span className="text-[10px] text-blue-400 mt-2 block">Minggu Ini di Media Sosial</span>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">
                    <span>SaaS Paket Aktif</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xl font-extrabold text-[#D4AF37] uppercase">{selectedPackage}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block">Maksimal Fitur Premium Tersedia</span>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start text-xs uppercase tracking-wider text-slate-500 mb-2 font-bold">
                    <span>Token Terpakai</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white font-mono">1.2k</p>
                  <span className="text-[10px] text-emerald-400 mt-1 block">✔ Terkoneksi Gemini-3.5-Flash</span>
                </div>
              </div>

              {/* CHARTS / CRM ANALYTICS PREVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Live SVG Analytics Chart */}
                <div className="lg:col-span-8 bg-[#090d1f] p-6 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Grafik Live Pertumbuhan Jangkauan & Leads (Simulasi Terpadu)
                      </h4>
                      <p className="text-xs text-slate-500">Menganalisis jangkauan multiplatform mingguan</p>
                    </div>
                    <div className="flex gap-4 text-xs font-mono">
                      <span className="text-[#D4AF37] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span> Instagram Reach
                      </span>
                      <span className="text-blue-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> TikTok Views
                      </span>
                    </div>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-4 border-b border-l border-slate-800 pb-2 pl-2">
                    {[
                      { l: "Sen", r: 60, v: 80 },
                      { l: "Sel", r: 85, v: 50 },
                      { l: "Rab", r: 40, v: 95 },
                      { l: "Kam", r: 90, v: 70 },
                      { l: "Jum", r: 75, v: 60 },
                      { l: "Sab", r: 100, v: 90 },
                      { l: "Min", r: 110, v: 120 }
                    ].map((step, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex justify-center gap-2 items-end h-32">
                          <div
                            style={{ height: `${step.r}%` }}
                            className="w-3 bg-gradient-to-t from-slate-900 to-[#D4AF37] rounded-t-sm"
                            title={`Reach: ${step.r * 100}`}
                          ></div>
                          <div
                            style={{ height: `${step.v}%` }}
                            className="w-3 bg-gradient-to-t from-slate-900 to-blue-500 rounded-t-sm"
                            title={`Views: ${step.v * 100}`}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">{step.l}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 mt-2 text-center">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider block">Total Impresi</p>
                      <p className="text-xl font-bold text-white font-mono">145,290</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider block">Pertumbuhan</p>
                      <p className="text-xl font-bold text-emerald-400 font-mono">+24.5%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider block">Konversi Leads</p>
                      <p className="text-xl font-bold text-[#D4AF37] font-mono">892 orang</p>
                    </div>
                  </div>
                </div>

                {/* Brand Guidelines Quick Glance Box */}
                <div className="lg:col-span-4 bg-[#090d1f] p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/35 px-2 py-0.5 rounded uppercase font-bold">
                      Brand Glance
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase mt-3 mb-4">
                      Konsep Visual Klien
                    </h4>
                    <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-lg border border-slate-800 mb-4">
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center font-bold text-[#020617] font-serif">
                        {clientData.namaBisnis.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{clientData.namaBisnis}</p>
                        <p className="text-xs text-[#D4AF37] italic font-mono">"{brandingResult?.slogan[0] || 'Premium Taste'}"</p>
                      </div>
                    </div>
                    <div className="text-xs space-y-2 text-slate-400">
                      <p>
                        <strong className="text-white text-[11px] uppercase block">Target Segmentasi:</strong> 
                        {clientData.targetPasar}
                      </p>
                      <p>
                        <strong className="text-white text-[11px] uppercase block">Lokasi:</strong> 
                        {clientData.lokasiUsaha}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setActiveTab("branding")}
                      className="w-full bg-slate-800 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold py-2 rounded transition-all uppercase"
                    >
                      Buka Generator Lengkap
                    </button>
                  </div>
                </div>

              </div>

              {/* MONETIZATION PACKAGES & SUMMARY GRID */}
              <div className="border-t border-slate-800/80 pt-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest text-center mb-6">
                  💸 SKEMA MONETISASI PREMIUM & TARGET PASAR SAAS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Paket Starter", price: "Rp 100.000", bg: "bg-slate-900/60", desc: "Cocok untuk UMKM baru. Generator slogan, bio sosial media, & 5 draf postingan reguler.", tag: "starter" },
                    { title: "Paket Basic", price: "Rp 200.000", bg: "bg-slate-900/60", desc: "Sangat populer bagi freelancers. Branding generator komplit ditambah 3 variasi warna logo SVG.", tag: "basic" },
                    { title: "Paket Professional", price: "Rp 300.000", bg: "border-2 border-[#D4AF37] bg-[#0c142c]", desc: "Lengkap dengan Video scripts, Instagram poster creator, editorial calendar mingguan, & drip WhatsApp funnel.", tag: "professional" },
                    { title: "Paket Business", price: "Rp 500.000", bg: "bg-slate-900/60", desc: "Akses Super Admin, WhatsApp chatbot FAQ tak terbatas, API ekspor, CRM tak terbatas, & manual book lengkap.", tag: "business" }
                  ].map((pkg, idx) => (
                    <div key={idx} className={`${pkg.bg} p-5 rounded-xl flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1`}>
                      <div>
                        {pkg.tag === selectedPackage && (
                          <span className="text-[9px] bg-[#D4AF37] text-black font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase block w-max mb-2">
                            PILIHAN ANDA
                          </span>
                        )}
                        <h5 className="text-sm font-bold text-white font-serif">{pkg.title}</h5>
                        <p className="text-lg font-extrabold text-[#D4AF37] font-mono mt-1 mb-2">{pkg.price}</p>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">{pkg.desc}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPackage(pkg.tag as any)}
                        className={`w-full mt-4 py-1.5 text-xs font-bold rounded uppercase transition-colors ${
                          pkg.tag === selectedPackage
                            ? "bg-[#D4AF37] text-black"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        Pilih Paket ini
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BRANDING GENERATOR */}
          {activeTab === "branding" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 1
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  PROFILING IDENTITAS BRAND AUTOMATION
                </h3>
                
                {/* Form Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Nama Bisnis *</label>
                    <input
                      type="text"
                      value={clientData.namaBisnis}
                      onChange={(e) => setClientData({ ...clientData, namaBisnis: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Nama Pribadi / Owner</label>
                    <input
                      type="text"
                      value={clientData.namaPribadi}
                      onChange={(e) => setClientData({ ...clientData, namaPribadi: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Bidang Usaha *</label>
                    <input
                      type="text"
                      value={clientData.bidangUsaha}
                      onChange={(e) => setClientData({ ...clientData, bidangUsaha: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Target Pasar *</label>
                    <input
                      type="text"
                      value={clientData.targetPasar}
                      onChange={(e) => setClientData({ ...clientData, targetPasar: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Lokasi Usaha</label>
                    <input
                      type="text"
                      value={clientData.lokasiUsaha}
                      onChange={(e) => setClientData({ ...clientData, lokasiUsaha: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Nomor WhatsApp *</label>
                    <input
                      type="text"
                      value={clientData.whatsapp}
                      onChange={(e) => setClientData({ ...clientData, whatsapp: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Email Kontak</label>
                    <input
                      type="text"
                      value={clientData.email}
                      onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Website</label>
                    <input
                      type="text"
                      value={clientData.website}
                      onChange={(e) => setClientData({ ...clientData, website: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                {/* Trigger Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleGenerateBranding}
                    disabled={loadingBrand}
                    className="bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:brightness-110 text-black font-bold text-xs px-6 py-3 rounded-lg shadow-xl shadow-[#D4AF37]/10 flex items-center gap-2 transition-all"
                  >
                    {loadingBrand ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        Mengolah Identitas AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        PROSES BRANDING DENGAN GEMINI AI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Branding Result View */}
              {brandingResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column outputs */}
                  <div className="space-y-6">
                    
                    {/* Suggested Brand names */}
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider mb-3">
                        💡 Rekomendasi Nama Brand & Filosofi
                      </h4>
                      <div className="space-y-3">
                        {brandingResult.suggestedBrandNames.map((nameObj, idx) => (
                          <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800/80">
                            <span className="text-[9px] text-[#D4AF37] font-mono leading-none tracking-wider uppercase">PILIHAN {idx + 1}</span>
                            <p className="text-sm font-extrabold text-white mt-0.5">{nameObj.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{nameObj.philosophy}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Slogan list */}
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider mb-3">
                        📣 Usulan Slogan & Tagline Catchy
                      </h4>
                      <ul className="space-y-2">
                        {brandingResult.slogan.map((sloganText, idx) => (
                          <li key={idx} className="flex gap-2 text-xs text-slate-300 p-2 bg-slate-950 rounded border border-slate-800/60">
                            <span className="text-[#D4AF37] font-mono font-bold">{idx + 1}.</span>
                            <span>"{sloganText}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Value Proposition */}
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs uppercase text-blue-400 font-bold tracking-wider mb-2">
                        💎 Value Proposition (Brand Promise)
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800/80">
                        {brandingResult.valueProposition}
                      </p>
                    </div>

                  </div>

                  {/* Right Column profiles & bios */}
                  <div className="space-y-6">
                    
                    {/* Company overview & profile */}
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider mb-2">
                        🏢 Profil & Deskripsi Bisnis Komprehensif
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded border border-slate-800 mb-3 whitespace-pre-line">
                        {brandingResult.businessDescription}
                      </p>
                      <h5 className="text-[11px] text-[#D4AF37] uppercase font-bold tracking-wider mb-1 mt-4">Visi & Misi Perusahaan:</h5>
                      <p className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded border border-slate-800 whitespace-pre-line leading-relaxed font-light">
                        {brandingResult.companyOverview}
                      </p>
                    </div>

                    {/* Social Media Bio Copies */}
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs uppercase text-emerald-400 font-bold tracking-wider mb-3">
                        📱 Copywriting Bio Media Sosial Optimis
                      </h4>
                      <div className="space-y-3 font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">Instagram Bio</span>
                          <pre className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-tight">
                            {brandingResult.socialMediaBio.instagram}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">TikTok Bio</span>
                          <pre className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-tight">
                            {brandingResult.socialMediaBio.tiktok}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">LinkedIn Page Description</span>
                          <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
                            {brandingResult.socialMediaBio.linkedin}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Elevator Pitch Box */}
                    <div className="bg-gradient-to-r from-indigo-950 to-slate-900 p-5 rounded-xl border border-slate-800">
                      <h4 className="text-xs uppercase text-yellow-400 font-bold tracking-wider mb-2 font-mono">
                        🎤 Elevator Pitch (60-Seconds Script)
                      </h4>
                      <p className="text-xs text-slate-200 italic leading-relaxed bg-slate-950/80 p-3.5 rounded border border-slate-800">
                        {brandingResult.elevatorPitch}
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: LOGO & BRAND KIT */}
          {activeTab === "logo" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 2
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  AI VECTOR LOGO CONCEPT & BRAND GUIDELINE
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Tema Warna Dominan</label>
                      <select
                        onChange={(e) => {
                          if (logoResult) {
                            let customPalette = ["#0A192F", "#D4AF37", "#FFFFFF", "#112240"];
                            if (e.target.value === "red") customPalette = ["#900C3F", "#FF5733", "#F9F9F9", "#111111"];
                            if (e.target.value === "green") customPalette = ["#1b4332", "#40916c", "#f4f9f4", "#2d3142"];
                            if (e.target.value === "purple") customPalette = ["#4a154b", "#E0AA3E", "#FAFAFA", "#221025"];
                            setLogoResult({ ...logoResult, hexPalette: customPalette });
                          }
                        }}
                        className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                      >
                        <option value="gold">Navy Premium & Emas Murni</option>
                        <option value="red">Merah Berani & Hitam Karbon</option>
                        <option value="green">Hijau Organika & Kelopak Putih</option>
                        <option value="purple">Ungu Keaisaran & Royal Gold</option>
                      </select>
                    </div>

                    <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                      <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Variasi Render File</h4>
                      <div className="space-y-1 text-xs">
                        <label className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" defaultChecked className="accent-[#D4AF37]" /> Versi Transparan PNG
                        </label>
                        <label className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" defaultChecked className="accent-[#D4AF37]" /> Versi Hitam Putih (Monokrom)
                        </label>
                        <label className="flex items-center gap-2 text-slate-300">
                          <input type="checkbox" defaultChecked className="accent-[#D4AF37]" /> Ekspor PDF Vector (300DPI)
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateLogo}
                      disabled={loadingLogo}
                      className="w-full bg-[#D4AF37] hover:brightness-110 text-black font-extrabold text-xs py-2.5 rounded uppercase tracking-wider transition-all"
                    >
                      {loadingLogo ? "Mengolah Konsep..." : "Perbarui Konsep Logo AI"}
                    </button>
                  </div>

                  {/* Mid Mockup Brand Identity Canvas */}
                  <div className="md:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] mb-4">
                      PREVIEW LOGO VECTOR & APPLIKASI MERCHANDISE
                    </span>

                    {/* DYNAMIC LOGO PREVIEW (SVG BUILD) */}
                    <div className="w-48 h-48 bg-gradient-to-br from-[#0c1329] to-slate-950 border-2 border-[#D4AF37]/30 rounded-2xl flex flex-col items-center justify-center p-4 relative mb-4 shadow-xl">
                      {/* Realistic SVG Logo representation */}
                      <svg className="w-16 h-16 text-[#D4AF37] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.1-7.843-.418m15.686 0a8.997 8.997 0 01-15.686 0" />
                      </svg>
                      <span className="text-white font-serif font-extrabold tracking-widest text-sm uppercase">
                        {clientData.namaBisnis}
                      </span>
                      <span className="text-[#D4AF37] text-[8px] font-mono tracking-widest uppercase mt-0.5">
                        {brandingResult?.slogan[0] || "PROMO EXCLUSIVE"}
                      </span>

                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {logoResult?.hexPalette.map((col, i) => (
                          <span key={i} style={{ backgroundColor: col }} className="w-2.5 h-2.5 rounded-full border border-slate-700"></span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert("Mengunduh format PDF Vector...")}
                        className="bg-slate-800 hover:bg-slate-700 text-[11px] px-3 py-1.5 rounded font-mono flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> PDF
                      </button>
                      <button
                        onClick={() => alert("Mengunduh format raw SVG transparan...")}
                        className="bg-slate-800 hover:bg-slate-700 text-[11px] px-3 py-1.5 rounded font-mono flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> SVG
                      </button>
                      <button
                        onClick={() => alert("Mengunduh format rasterized high-res PNG...")}
                        className="bg-slate-800 hover:bg-slate-700 text-[11px] px-3 py-1.5 rounded font-mono flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> PNG
                      </button>
                    </div>

                  </div>

                </div>

                {/* Additional Brand kits outputs */}
                {logoResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80">
                    <div className="bg-slate-900/60 p-4 rounded border border-slate-800">
                      <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider mb-2">🎨 Filosofi Konsep Visual AI</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light bg-slate-950 p-3 rounded">
                        {logoResult.suggestionConcept}
                      </p>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded border border-slate-800">
                      <h4 className="text-xs uppercase text-blue-400 font-bold tracking-wider mb-2">✒ Petunjuk Tipografi & Font Kit</h4>
                      <div className="bg-slate-950 p-3 rounded text-xs space-y-2">
                        <p><strong className="text-white">Heading Font:</strong> <span className="text-[#D4AF37] font-mono">{logoResult.recommendedTypography.headingFont}</span></p>
                        <p><strong className="text-white">Body Font:</strong> <span className="font-mono">{logoResult.recommendedTypography.bodyFont}</span></p>
                        <p className="text-slate-400 leading-normal text-[11px] italic">{logoResult.recommendedTypography.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL MEDIA SETUP ASSISTANT */}
          {activeTab === "social" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-teal-950 to-slate-900 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold font-mono tracking-widest block mb-1">
                  MODULE 3
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-2">
                  SOCIAL MEDIA CREATION & SETUP ASSISTANT
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Gunakan panduan checklist pragmatis ini untuk mendirikan kehadiran baru brand Anda secara legal dan profesional di berbagai ekosistem raksasa media sosial Indonesia.
                </p>
              </div>

              {/* Generator Username & Suggestion bios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Generation triggers & suggestions */}
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider mb-2">
                    🛠 Username Generator & Hashtags Recom
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                      <span className="text-[9px] text-[#D4AF37] uppercase block font-mono">Usulan ID Utama</span>
                      <code className="text-sm font-bold text-white block mt-1">
                        @{clientData.namaBisnis.toLowerCase().replace(/\s+/g, "")}.official
                      </code>
                    </div>
                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block font-mono">Usulan ID Cadangan</span>
                      <code className="text-sm font-bold text-slate-300 block mt-1">
                        @{clientData.namaBisnis.toLowerCase().replace(/\s+/g, "")}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 block">HASHTAG REKOMENDASI AI</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {contentResult?.hashtags.map((ht, i) => (
                        <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 text-[#D4AF37] px-2 py-0.5 rounded">
                          {ht}
                        </span>
                      )) || <span className="text-xs text-slate-500">Isi branding generator dulu</span>}
                    </div>
                  </div>
                </div>

                {/* Checklist steps of creation */}
                <div className="md:col-span-2 bg-[#090d1f] p-5 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="text-xs uppercase text-teal-400 font-bold tracking-wider mb-3">
                    📝 Panduan Pembuatan Akun Bisnis & Checklist Verifikasi
                  </h4>

                  <div className="space-y-3">
                    {[
                      { key: "fbPage", label: "Hubungkan Fanspage Facebook Bisnis", desc: "Isi nama halaman persis sesuai ${clientData.namaBisnis}. Hubungkan tombol pesan utama direct ke WhatsApp link kontak." },
                      { key: "igBusiness", label: "Instagram Creator / Professional Business Account", desc: "Ubah akun pribadi ke akun profesional. Masukkan url website ${clientData.website || '-'} dan nomor telepon." },
                      { key: "tiktokBusiness", label: "TikTok Business Center Integration", desc: "Pastikan klaim Bio komplit, cantumkan kategori bisnis agar algoritma mengarah efisien ke audiens ideal Anda." },
                      { key: "youtubeChannel", label: "Google / YouTube Creator Portal", desc: "Lengkapi deskripsi branding di halaman About us dan kaitkan logo transparan kami sebagai profil." },
                      { key: "linkedinPage", label: "LinkedIn Company Organization Page", desc: "Ideal untuk menjalin B2B partnership dengan partner komersial strategis." },
                      { key: "gbp", label: "Google Business Profile Map Pinning", desc: "Klaim titik map di Google Maps Bandung untuk memicu pencarian audiens lokal secara gratis!" }
                    ].map((step) => (
                      <div key={step.key} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={(socialChecklist as any)[step.key]}
                          onChange={(e) => setSocialChecklist({ ...socialChecklist, [step.key]: e.target.checked })}
                          className="mt-1 accent-teal-400 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{step.label}</p>
                          <p className="text-[11px] text-slate-400 mt-1 leading-normal font-light">
                            {step.desc.replace("${clientData.namaBisnis}", clientData.namaBisnis).replace("${clientData.website || '-'}", clientData.website || "-")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 p-3 rounded text-center">
                    <span className="text-[11px] text-slate-400 leading-normal">
                      ℹ <strong>Sistem hanya membantu & memicu draf data.</strong> Seluruh proses pembuatan adalah asisten panduan kepatuhan resmi tanpa membypass ketentuan login platform masing-masing.
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: AI CONTENT GENERATOR */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 4
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  COPYWRITING AUTOMATION ENGINE
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Platform Pilihan</label>
                    <select
                      value={contentPlatform}
                      onChange={(e) => setContentPlatform(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-1.5 outline-none focus:border-[#D4AF37] font-mono"
                    >
                      <option value="Instagram Post">Instagram Post / Feed</option>
                      <option value="TikTok Script">TikTok Short Video (Reels)</option>
                      <option value="Blog Article">Artikel Blog SEO</option>
                      <option value="WhatsApp Broadcast">Saluran Broadcast Copy</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Gaya Bahasa / Tone</label>
                    <select
                      value={contentTone}
                      onChange={(e) => setContentTone(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-1.5 outline-none focus:border-[#D4AF37] font-mono"
                    >
                      <option value="Inspiratif">Inspiratif & Edukatif</option>
                      <option value="Humoris">Humor / Santai & Lucu</option>
                      <option value="Hard Selling">Penjualan Langsung (Hard Selling)</option>
                      <option value="Soft Selling">Edukasi Halus (Soft Selling)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Kata Kunci Penting</label>
                    <input
                      type="text"
                      value={contentKeywords}
                      onChange={(e) => setContentKeywords(e.target.value)}
                      placeholder="Contoh: Terpercaya, Segar, Harga Termurah"
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-1.5 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Topik Utama Tulisan / Deskripsi Promo</label>
                    <input
                      type="text"
                      value={contentTopic}
                      onChange={(e) => setContentTopic(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleGenerateContent}
                    disabled={loadingContent}
                    className="bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black font-extrabold text-xs px-6 py-2.5 rounded shadow-lg shadow-[#D4AF37]/10 flex items-center gap-1"
                  >
                    {loadingContent ? "Menulis Copy..." : "Generasi Copywriting AI"}
                  </button>
                </div>
              </div>

              {contentResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Headline & copy texts */}
                  <div className="lg:col-span-2 bg-[#090d1f] p-5 rounded-xl border border-slate-800 space-y-4">
                    <div>
                      <span className="text-[10px] text-[#D4AF37] uppercase font-mono block mb-1">REKOMENDASI JUDUL (CLICKBAIT BERSIH)</span>
                      <h4 className="text-base font-bold text-white border-l-4 border-[#D4AF37] pl-3 py-1 bg-slate-950 rounded-r">
                        {contentResult.recommendedTitle}
                      </h4>
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-400 uppercase font-mono block mb-1">HOOK PEMBUKA 3-DETIK PERTAMA</span>
                      <p className="text-xs text-slate-200 font-bold bg-slate-950 p-3 rounded border border-slate-800 italic">
                        "{contentResult.primaryHook}"
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">BODY COPYWRITING TEXT (CTA INTEGRASI)</span>
                      <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded border border-slate-800 whitespace-pre-wrap">
                        {contentResult.bodyText}
                      </div>
                    </div>
                  </div>

                  {/* Script dialogue scenarion or subsections details */}
                  <div className="bg-[#090d1f] p-5 rounded-xl border border-slate-800 space-y-4">
                    <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider">
                      🎬 Storyboard / Naskah Dialog Video Singkat
                    </h4>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {contentResult.scriptDialogLines.map((line, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono block w-max uppercase mb-1">
                            {line.scene}
                          </span>
                          <p className="text-slate-400 text-[11px] leading-tight mb-1">
                            <strong className="text-white">Visual:</strong> {line.visual}
                          </p>
                          <p className="text-slate-200 italic leading-snug">
                            <strong className="text-white">Audio:</strong> "{line.audio}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(contentResult.bodyText);
                          alert("Naskah berhasil disalin ke clipboard!");
                        }}
                        className="w-full bg-slate-800 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-white font-mono text-[10px] py-1.5 rounded uppercase"
                      >
                        Salin Copywriting
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 6: AI POSTER GENERATOR */}
          {activeTab === "poster" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 5
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  DIAGRAM & POSTER PROMO CREATIVE STUDIO
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Parameters controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Judul Utama Poster</label>
                      <input
                        type="text"
                        value={posterText}
                        onChange={(e) => setPosterText(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Sub-judul / Diskon Promo</label>
                      <input
                        type="text"
                        value={posterSubtext}
                        onChange={(e) => setPosterSubtext(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Dimensi Otomatis</label>
                      <select
                        value={posterSize}
                        onChange={(e) => setPosterSize(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded p-2 outline-none focus:border-[#D4AF37] font-mono"
                      >
                        <option value="1080x1080">1080x1080 px (Quad Instagram Feed)</option>
                        <option value="1080x1350">1080x1350 px (Portrait Instagram Feed)</option>
                        <option value="1080x1920">1080x1920 px (Instagram Story / WA Status)</option>
                        <option value="1280x720">1280x720 px (YouTube Thumbnail)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Warna Aksen Grafis</label>
                      <div className="flex gap-2">
                        {["#D4AF37", "#f43f5e", "#10b981", "#3b82f6", "#a855f7"].map((col) => (
                          <button
                            key={col}
                            onClick={() => setPosterColor(col)}
                            style={{ backgroundColor: col }}
                            className={`w-6 h-6 rounded-full border-2 ${
                              posterColor === col ? "border-white" : "border-transparent"
                            }`}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Creative canvas render mockup */}
                  <div className="md:col-span-3 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-4">
                      PREVIEW LIVE GENERATOR RENDERING ({posterSize} PX)
                    </span>

                    {/* Canvas frame */}
                    <div
                      style={{
                        borderColor: posterColor,
                        aspectRatio: posterSize === "1080x1080" ? "1/1" : posterSize === "1080x1350" ? "4/5" : posterSize === "1080x1920" ? "9/16" : "16/9",
                        width: posterSize === "1080x1920" ? "180px" : "320px"
                      }}
                      className="bg-gradient-to-br from-[#0c0e1e] via-[#09152b] to-slate-950 border-2 rounded-xl flex flex-col justify-between p-6 relative overflow-hidden transition-all duration-300 shadow-2xl"
                    >
                      {/* Geometric grid design behind */}
                      <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 pointer-events-none text-xs text-slate-400">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <span key={i} className="p-1 font-mono">✦</span>
                        ))}
                      </div>

                      {/* Top Header of poster */}
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="text-[9px] bg-white/10 text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
                          {clientData.namaBisnis}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-[10px]">
                          ⭐
                        </div>
                      </div>

                      {/* Main Message layout */}
                      <div className="relative z-10 my-auto text-center">
                        <h4 style={{ color: posterColor }} className="text-xl font-serif font-extrabold tracking-tight drop-shadow-md">
                          {posterText}
                        </h4>
                        <div className="w-12 h-1 bg-white/20 mx-auto my-3"></div>
                        <p className="text-xs text-slate-300 font-medium">
                          {posterSubtext}
                        </p>
                      </div>

                      {/* Footer dynamic information */}
                      <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-3">
                        <div>
                          <p className="text-[8px] text-slate-500 uppercase block font-mono">INFO PEMBELIAN</p>
                          <p className="text-[10px] text-white font-bold font-mono">{clientData.whatsapp}</p>
                        </div>
                        <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37]/45 px-1.5 py-0.5 rounded text-[8px] font-mono leading-none tracking-widest uppercase">
                          PREMIUM TASTE
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => alert("Mengekspor poster ke resolusi tinggi ready to print...")}
                        className="bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black text-xs font-bold px-6 py-2 rounded-full"
                      >
                        Download Resolusi Penuh PNG
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI VIDEO STORYBOARD CREATOR */}
          {activeTab === "video" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#090d1f] p-6 rounded-xl border border-slate-800 space-y-4">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block">
                  MODULE 6
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif">
                  AI TEXT-TO-VIDEO STORYBOARD PLANNER
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Controls */}
                  <div className="bg-slate-950 p-5 rounded border border-slate-800 space-y-4">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold block mb-1">Tulis Konsep Utama Video</label>
                      <textarea
                        value={videoScriptInput}
                        onChange={(e) => setVideoScriptInput(e.target.value)}
                        rows={3}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-2 focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked /> Voice Over AI Instan (Suara Cowok Indonesia)
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked /> Subtitle Otomatis Terbenam (Burn-in)
                      </label>
                    </div>

                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className={`w-full font-bold text-xs py-2.5 rounded uppercase tracking-wider transition-all ${
                        isVideoPlaying ? "bg-red-500 text-white" : "bg-[#D4AF37] text-black"
                      }`}
                    >
                      {isVideoPlaying ? "Stop Simulasi Video" : "Simulasikan Playback Video"}
                    </button>
                  </div>

                  {/* Mid Device simulation player */}
                  <div className="lg:col-span-2 bg-slate-950 p-6 rounded border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider mb-3">
                      IMERSIVE SMARTPHONE PREVIEW PLAYER (TIKTOK MOD)
                    </span>

                    {/* Smartphone shape */}
                    <div className="w-[180px] h-[320px] bg-black rounded-3xl border-4 border-slate-800 relative flex flex-col justify-between p-4 overflow-hidden shadow-2xl">
                      
                      {/* Subtitle preview timeline block */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between text-[8px] text-white/50 font-mono">
                        <span>LIVE PREVIEW</span>
                        <span>0:0{videoSec} / 0:15</span>
                      </div>

                      {/* Interactive Visual Canvas change with frames state */}
                      <div className="absolute inset-x-0 top-12 bottom-16 bg-slate-900/60 flex items-center justify-center p-3 text-center">
                        {videoSec === 0 && (
                          <div className="animate-fade-in text-[10px]">
                            <p className="text-white font-bold">🎬 FRAME 1: INTRO</p>
                            <p className="text-slate-400 mt-2 font-mono italic">Barista menyiapkan filter porselen, menuang air panas 93°C mekar berbusa.</p>
                          </div>
                        )}
                        {videoSec === 1 && (
                          <div className="animate-fade-in text-[10px]">
                            <p className="text-[#D4AF37] font-bold">🎬 FRAME 2: PROBLEM</p>
                            <p className="text-slate-400 mt-2 font-mono italic">Ekspresi orang mengerutkan dahi mencicip kopi basi seminggu.</p>
                          </div>
                        )}
                        {videoSec === 2 && (
                          <div className="animate-fade-in text-[10px]">
                            <p className="text-green-400 font-bold">🎬 FRAME 3: VALUE ADDED</p>
                            <p className="text-slate-400 mt-2 font-mono italic">Menunjukkan logo {clientData.namaBisnis} tertempel presisi di bungkus berzipper.</p>
                          </div>
                        )}
                        {videoSec >= 3 && (
                          <div className="animate-fade-in text-[10px]">
                            <p className="text-blue-500 font-bold">🎬 FRAME 4: ACTION CTA</p>
                            <p className="text-slate-400 mt-2 font-mono italic">Barista menunjuk bio link dengan teks discount melayang.</p>
                          </div>
                        )}
                      </div>

                      {/* Burn-in Subtitles overlay */}
                      <div className="z-10 bg-black/60 p-2 border border-slate-800 rounded mx-auto text-center w-full max-w-[150px] mb-4">
                        <span className="text-[#D4AF37] text-[9px] uppercase font-bold tracking-tight block">🔥 SUBTITLE AI</span>
                        <p className="text-white text-[9px] tracking-tight leading-snug mt-1 font-mono italic">
                          {videoSec === 0 && "Udah benar belum seduhan kopi Anda pagi ini?"}
                          {videoSec === 1 && "Jangan sampai minum bubuk kopi apek basi ya!"}
                          {videoSec === 2 && "Kopi Lestari menyajikan kehangatan biji segar Nusantara."}
                          {videoSec >= 3 && "Yuk hubungi kami dan buktikan aromanya hari ini!"}
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-slate-400">
                        🔊 <strong>Voice Over AI:</strong> "Halo pecinta kafein... ({clientData.namaBisnis} roastery siap memicu harimu)"
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 8: CONTENT CALENDAR */}
          {activeTab === "calendar" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                      MODULE 7
                    </span>
                    <h3 className="text-lg font-bold text-white uppercase font-serif">
                      AUTOMATED EDITORIAL CONTENT CALENDAR
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      const newSch = {
                        id: Date.now(),
                        day: "Sabtu",
                        type: "Facebook Post",
                        topic: "Tips weekend asyik eksplorasi biji kopi sachet",
                        time: "09:00",
                        status: "Planned"
                      };
                      setCalendarItems([...calendarItems, newSch]);
                    }}
                    className="bg-[#D4AF37] hover:brightness-110 text-black font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 uppercase"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Schedule
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-[#090d1f] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Hari Terbit</th>
                        <th className="p-3">Media Platform</th>
                        <th className="p-3">Topik Utama Pemasaran</th>
                        <th className="p-3">Waktu Post</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {calendarItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-bold text-white uppercase">{item.day}</td>
                          <td className="p-3 font-mono text-[#D4AF37]">{item.type}</td>
                          <td className="p-3">{item.topic}</td>
                          <td className="p-3 font-mono text-slate-400">{item.time} WIB</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === "Published" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setCalendarItems(calendarItems.filter(c => c.id !== item.id))}
                              className="text-red-400 hover:text-red-300 font-bold"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 9: MARKETING FUNNEL BUILDER */}
          {activeTab === "funnel" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 8
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  CONVERSION FUNNEL & CUSTOMER JOURNEY DESIGNER
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Stage outline box */}
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                      <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider">
                        📉 Alur Funneling Konversi AIDA
                      </h4>

                      {funnelResult && (
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                            <span className="text-[9px] text-[#D4AF37] font-bold uppercase block font-mono">1. Awareness</span>
                            <p className="text-slate-300 mt-0.5">{funnelResult.salesFunnelStages.awareness}</p>
                          </div>
                          <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                            <span className="text-[9px] text-blue-400 font-bold uppercase block font-mono">2. Interest</span>
                            <p className="text-slate-300 mt-0.5">{funnelResult.salesFunnelStages.interest}</p>
                          </div>
                          <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                            <span className="text-[9px] text-purple-400 font-bold uppercase block font-mono">3. Decision</span>
                            <p className="text-slate-300 mt-0.5">{funnelResult.salesFunnelStages.decision}</p>
                          </div>
                          <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                            <span className="text-[9px] text-emerald-400 font-bold uppercase block font-mono">4. Action / Purchase</span>
                            <p className="text-slate-300 mt-0.5">{funnelResult.salesFunnelStages.action}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Headlines & Sequences outputs */}
                  <div className="lg:col-span-2 space-y-6">
                    {funnelResult && (
                      <>
                        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                          <span className="text-[9px] text-[#D4AF37] uppercase font-mono block mb-1">HIGH-CONVERTING LANDING PAGE HEADLINE</span>
                          <h4 className="text-sm font-bold text-white bg-slate-950 p-3 rounded border border-slate-800">
                            {funnelResult.landingPageHeadline}
                          </h4>
                          <span className="text-[9px] text-slate-400 mt-1 block">Lead Magnet: "{funnelResult.leadMagnetTitle}"</span>
                        </div>

                        {/* Email automation drip */}
                        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                          <h4 className="text-xs uppercase text-blue-400 font-bold tracking-wider mb-3">
                            📧 Drip Campaign: Rantai Sekuensial Email Otomatis
                          </h4>
                          <div className="space-y-3">
                            {funnelResult.emailSequence.map((email, idx) => (
                              <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[#D4AF37] font-bold">Email {idx + 1} (Hari ke-{email.delayInDays})</span>
                                  <span className="text-[10px] text-slate-500">Auto-sender</span>
                                </div>
                                <p className="text-white font-mono font-semibold mb-1">Subjek: {email.subject}</p>
                                <p className="text-slate-400 text-xs leading-relaxed">{email.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* WhatsApp sequential drip */}
                        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                          <h4 className="text-xs uppercase text-emerald-400 font-bold tracking-wider mb-2">
                            💬 Rantai Pesan Follow-Up WhatsApp Instant
                          </h4>
                          <div className="space-y-3">
                            {funnelResult.whatsappSequence.map((waMsg, idx) => (
                              <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono">
                                <span className="text-emerald-400 font-bold uppercase text-[9px] block mb-1">{waMsg.tag}</span>
                                <p className="text-slate-300 leading-normal whitespace-pre-wrap">{waMsg.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 10: WHATSAPP AUTO REPLY & MARKETING BROADCAST */}
          {activeTab === "whatsapp" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#090d1f] p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 9
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  WHATSAPP BROADCAST & INTELLIGENT FAQ AUTOREPLY
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Controls layout */}
                  <div className="space-y-4">
                    
                    {/* Live Broadcast Sender Box */}
                    <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                      <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider">
                        📢 WhatsApp Blast Broadcast
                      </h4>
                      <div className="text-xs text-slate-400 mb-2">
                        Mengirimkan pesan promosi ini secara serentak ke <strong>{crmClients.length}</strong> kontak aktif di database CRM Anda.
                      </div>
                      <textarea
                        value={waMessageText}
                        onChange={(e) => setWaMessageText(e.target.value)}
                        rows={3}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5 outline-none font-mono"
                      />
                      <button
                        onClick={triggerWaBroadcast}
                        className="w-full bg-[#D4AF37] hover:brightness-110 text-black font-bold text-xs py-2 rounded uppercase"
                      >
                        Kirim Siaran Sekarang
                      </button>
                    </div>

                    {/* FAQ Configuration */}
                    <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-3">
                      <h4 className="text-xs uppercase text-blue-400 font-bold tracking-wider">
                        🤖 Konfigurasi Chatbot FAQ Otomatis
                      </h4>
                      <div className="space-y-2">
                        {chatbotFaqs.map((faq, idx) => (
                          <div key={idx} className="p-2 bg-slate-900 rounded text-xs">
                            <p className="font-bold text-white font-mono">Kata kunci: "{faq.keyword}"</p>
                            <p className="text-slate-400 italic font-mono text-[11px]">Balas: "{faq.reply}"</p>
                          </div>
                        ))}
                      </div>

                      {/* Add FAQ form */}
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <input
                          type="text"
                          placeholder="Kata kunci baru (misal: jor)"
                          value={newChatbotKeyword}
                          onChange={(e) => setNewChatbotKeyword(e.target.value)}
                          className="w-full text-xs bg-slate-900 border border-slate-800 text-white p-1 rounded font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Pesan jawaban otomatis"
                          value={newChatbotReply}
                          onChange={(e) => setNewChatbotReply(e.target.value)}
                          className="w-full text-xs bg-slate-900 border border-slate-800 text-white p-1 rounded font-mono"
                        />
                        <button
                          onClick={() => {
                            if (!newChatbotKeyword || !newChatbotReply) return;
                            setChatbotFaqs([...chatbotFaqs, { keyword: newChatbotKeyword.toLowerCase(), reply: newChatbotReply }]);
                            setNewChatbotKeyword("");
                            setNewChatbotReply("");
                          }}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-xs py-1 text-white rounded font-bold"
                        >
                          Simpan Aturan Chatbot
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Sandbox logger & device preview */}
                  <div className="lg:col-span-2 bg-slate-950 p-5 rounded border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs uppercase text-emerald-400 font-bold tracking-wider mb-2 font-mono">
                        🖥 LIVE WA SIMULATOR CONSOLE
                      </h4>
                      <div className="h-64 bg-slate-900 rounded p-4 font-mono text-[10px] space-y-2 overflow-y-auto border border-slate-800 text-slate-300">
                        {waConsoleLogs.map((log, idx) => (
                          <div key={idx} className="border-b border-slate-800 pb-1">
                            <span className="text-[#D4AF37]">[LOG-{idx + 1}]</span> {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-between gap-4 text-xs">
                      <span className="text-slate-500">
                        *Sistem sandbox sepenuhnya tidak memicu pemblokiran nomor eksternal. Semua operasi bersifat simulasi terenkripsi.
                      </span>
                      <button
                        onClick={() => setWaConsoleLogs(["WA Console logs cleared."])}
                        className="text-red-400 hover:text-red-300 font-bold whitespace-nowrap"
                      >
                        Bersihkan Log
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 11: CUSTOMER DATABASE CRM */}
          {activeTab === "crm" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 10
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-4">
                  CUSTOMER RELATIONSHIP MANAGEMENT (CRM DATABASE)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Form: Create & Edit Client */}
                  <form onSubmit={handleSaveClientCrm} className="bg-slate-950 p-5 rounded border border-slate-800 space-y-3">
                    <h4 className="text-xs uppercase text-[#D4AF37] font-bold tracking-wider mb-2">
                      {selectedCrmClient ? "📝 Edit Data Kontak Klien" : "➕ Daftarkan Client Baru"}
                    </h4>

                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={crmForm.name}
                        onChange={(e) => setCrmForm({ ...crmForm, name: e.target.value })}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5 focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1">Nama Bisnis / Brand *</label>
                      <input
                        type="text"
                        required
                        value={crmForm.business}
                        onChange={(e) => setCrmForm({ ...crmForm, business: e.target.value })}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5 focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1">Email</label>
                      <input
                        type="email"
                        value={crmForm.email}
                        onChange={(e) => setCrmForm({ ...crmForm, email: e.target.value })}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5 focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1">Nomor Handphone / WA</label>
                      <input
                        type="text"
                        value={crmForm.phone}
                        onChange={(e) => setCrmForm({ ...crmForm, phone: e.target.value })}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5 focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-300 uppercase block mb-1">Status Prospek</label>
                        <select
                          value={crmForm.status}
                          onChange={(e) => setCrmForm({ ...crmForm, status: e.target.value as any })}
                          className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5"
                        >
                          <option value="Lead">Lead baru</option>
                          <option value="Prospect">Prospect</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-300 uppercase block mb-1">Segmentasi Pasar</label>
                        <input
                          type="text"
                          value={crmForm.segment}
                          onChange={(e) => setCrmForm({ ...crmForm, segment: e.target.value })}
                          className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1">Kota / Lokasi</label>
                      <input
                        type="text"
                        value={crmForm.location}
                        onChange={(e) => setCrmForm({ ...crmForm, location: e.target.value })}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300 uppercase block mb-1">Catatan Interaksi Terkini</label>
                      <textarea
                        value={crmForm.notes}
                        onChange={(e) => setCrmForm({ ...crmForm, notes: e.target.value })}
                        rows={2}
                        className="w-full text-xs bg-slate-900 border border-slate-800 text-white rounded p-1.5"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      {selectedCrmClient && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCrmClient(null);
                            setCrmForm({ name: "", business: "", email: "", phone: "", status: "Lead", segment: "F&B", location: "Jakarta", notes: "" });
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#D4AF37] hover:brightness-110 text-black font-extrabold text-xs rounded uppercase"
                      >
                        {selectedCrmClient ? "Update Client" : "Daftarkan Client"}
                      </button>
                    </div>
                  </form>

                  {/* Right List: CRM Client database entries */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                      <div>
                        <h4 className="text-xs uppercase text-white font-bold">Daftar Klien UMKM Aktif</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Sinkron server: express port 3000</p>
                      </div>
                      <input
                        type="text"
                        placeholder="Cari nama / usaha..."
                        value={searchCrmQuery}
                        onChange={(e) => setSearchCrmQuery(e.target.value)}
                        className="text-xs bg-slate-900 border border-slate-800 text-white rounded px-2.5 py-1 outline-none"
                      />
                    </div>

                    <div className="space-y-3 max-h-[450px] overflow-y-auto">
                      {crmClients
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(searchCrmQuery.toLowerCase()) ||
                            c.business.toLowerCase().includes(searchCrmQuery.toLowerCase())
                        )
                        .map((c) => (
                          <div key={c.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl relative hover:border-[#D4AF37]/35 transition-all">
                            {/* Accent indicator of status */}
                            <span className={`absolute top-4 right-4 text-[9px] px-2 py-0.5 rounded uppercase font-bold ${
                              c.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : c.status === "Prospect" ? "bg-blue-500/10 text-blue-400" : "bg-yellow-500/10 text-[#D4AF37]"
                            }`}>
                              {c.status}
                            </span>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded flex items-center justify-center font-bold font-serif text-[#D4AF37]">
                                {c.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-white leading-none mb-1">{c.name}</h5>
                                <p className="text-xs text-slate-400">{c.business} &bull; <span className="font-mono text-[#D4AF37]">{c.segment}</span></p>
                                <p className="text-xs text-slate-500 mt-2">📍 {c.location} | WA: {c.phone} | Email: {c.email}</p>
                                <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-2 border border-slate-800 rounded font-light">{c.notes}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 justify-end mt-3 pt-3 border-t border-slate-900/60 text-xs">
                              <button
                                onClick={() => {
                                  setSelectedCrmClient(c);
                                  setCrmForm({
                                    name: c.name,
                                    business: c.business,
                                    email: c.email,
                                    phone: c.phone,
                                    status: c.status,
                                    segment: c.segment,
                                    location: c.location,
                                    notes: c.notes
                                  });
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Edit Profile
                              </button>
                              <button
                                onClick={() => handleDeleteCrm(c.id)}
                                className="text-red-400 hover:text-red-300 border-l border-slate-800 pl-2"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 12: BLUEPRINTS, SOURCE CODE & DELIVERABLES */}
          {activeTab === "blueprints" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
                <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-widest font-mono block mb-1">
                  MODULE 11
                </span>
                <h3 className="text-lg font-bold text-white uppercase font-serif mb-2">
                  DOKUMENTASI PRODUKSI & METADATA ARCHITECTURE
                </h3>
                <p className="text-xs text-slate-400 leading-normal mb-6">
                  Berikut adalah seluruh dokumen pendukung integrasi dan operasional cloud siap diproduksi dari platfom ABDI AUTOMATION:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {["folderStructure", "databaseSchema", "erd", "apiDocumentation", "deploymentGuide", "userManual", "adminManual", "securityBestPractices"].map((docKey) => (
                    <button
                      key={docKey}
                      onClick={() => alert(`Berikut adalah dokumen resmi ${docKey}. Silakan baca rincian lengkapnya pada view scrollbox di bawah.`)}
                      className="text-left bg-slate-950 hover:bg-[#D4AF37]/10 p-3 rounded border border-slate-800 text-xs font-mono font-bold uppercase transition-all flex items-center justify-between"
                    >
                      <span>📎 {docKey.replace(/([A-Z])/g, " $1")}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Display container of raw documents */}
                <div className="space-y-6">
                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-[#D4AF37] mb-2">1. STRUKTUR MAP FOLDER PRODUKSI</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.folderStructure}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-blue-400 mb-2">2. POSTGRESQL DATABASE SCHEMA (CLOUD SQL READY)</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.databaseSchema}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-purple-400 mb-2">3. SCHEMATIC ERD VISUALIZATION</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.erd}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-emerald-400 mb-2">4. REST API DOCS</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.apiDocumentation}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-yellow-400 mb-2">5. CLOUD RUN DEPLOYMENT GUIDE</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.deploymentGuide}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-teal-400 mb-2">6. USER PROFILE MANUAL (INDONESIAN)</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.userManual}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-indigo-400 mb-2">7. ADMIN / SUPER ADMIN MANUAL</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.adminManual}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                    <h4 className="text-xs uppercase font-mono text-pink-400 mb-2">8. SECURITY & API INJECTION BEST PRACTICES</h4>
                    <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800 font-mono leading-tight">
                      {SaaS_Deliverables.securityBestPractices}
                    </pre>
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>

        {/* METADATA PRE-GENERATION GRAPHICS FOOTER COMPLIANT */}
        <footer className="h-12 px-6 md:px-10 flex items-center justify-between bg-[#090d1f] border-t border-slate-800/80 text-[10px] text-slate-500 shrink-0 uppercase tracking-widest z-10">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> 
              Cloud Container: Online
            </span>
            <span className="hidden md:inline-block">
              &bull; database_id: firestore-blueprints
            </span>
          </div>
          <div>
            &copy; 2026 ABDI AUTOMATION CORP &bull; Premium Sophisticated Minimalist Kit
          </div>
        </footer>

      </main>
    </div>
  );
}
