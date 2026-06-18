import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// CRM Client database stored in-memory (and initialized with realistic ID SME clients)
const crmClients = [
  {
    id: "C-101",
    name: "Siti Rahma",
    business: "Kopi Nusantara Jaya",
    email: "siti@kopinusantara.id",
    phone: "081234567890",
    status: "Active",
    segment: "F&B Premium",
    location: "Bandung",
    notes: "Tertarik dengan branding Instagram & desain kemasan baru."
  },
  {
    id: "C-102",
    name: "Budi Santoso",
    business: "Batik Luhur Solo",
    email: "budi@batikluhursolo.com",
    phone: "081987654321",
    status: "Prospect",
    segment: "Fashion Lokal",
    location: "Surakarta",
    notes: "Membutuhkan setup TikTok Creator Shop dan WhatsApp Automation CRM."
  },
  {
    id: "C-103",
    name: "Dewi Lestari",
    business: "Dewi Skin & Beauty",
    email: "dewi.lestari@dewibeauty.id",
    phone: "085522334455",
    status: "Active",
    segment: "Skincare / Aesthetic",
    location: "Jakarta Selatan",
    notes: "Sudah setup funnel landing page. Butuh copy bulanan terjadwal."
  },
  {
    id: "C-104",
    name: "Andi Wijaya",
    business: "Andi Tech Service",
    email: "andi@anditech.co.id",
    phone: "087766554433",
    status: "Lead",
    segment: "Jasa IT",
    location: "Surabaya",
    notes: "Baru masuk dari lead magnet Facebook Ads. Follow-up proposal."
  }
];

// Helper to initialize Gemini safely (Lazy Initialization)
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    // We will initialize even if key is missing, but will throw custom error on call or use mock
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_IF_ABSENT",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
};

// Check if Gemini API Key is available
const isGeminiAvailable = (): boolean => {
  return !!process.env.GEMINI_API_KEY;
};

// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    geminiConfigured: isGeminiAvailable(),
    timestamp: new Date().toISOString()
  });
});

// CLIENTS CRM CRUD API
app.get("/api/crm/clients", (req, res) => {
  res.json(crmClients);
});

app.post("/api/crm/clients", (req, res) => {
  const { name, business, email, phone, status, segment, location, notes } = req.body;
  if (!name || !business) {
    return res.status(400).json({ error: "Nama dan Bidang Usaha wajib diisi." });
  }

  const newClient = {
    id: `C-${Date.now().toString().slice(-4)}`,
    name,
    business,
    email: email || "-",
    phone: phone || "-",
    status: status || "Prospect",
    segment: segment || "Lain-lain",
    location: location || "Indonesia",
    notes: notes || ""
  };

  crmClients.unshift(newClient);
  res.status(201).json(newClient);
});

app.put("/api/crm/clients/:id", (req, res) => {
  const { id } = req.params;
  const index = crmClients.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Client tidak ditemukan." });
  }

  crmClients[index] = {
    ...crmClients[index],
    ...req.body,
    id // preserve original ID
  };

  res.json(crmClients[index]);
});

app.delete("/api/crm/clients/:id", (req, res) => {
  const { id } = req.params;
  const index = crmClients.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Client tidak ditemukan." });
  }
  crmClients.splice(index, 1);
  res.json({ success: true, message: `Client dengan ID ${id} berhasil dihapus.` });
});

// BRANDING AUTOMATION GENERATOR (GEMINI & FALLBACK PROXY)
app.post("/api/generate-branding", async (req, res) => {
  const { namaBisnis, namaPribadi, bidangUsaha, targetPasar, lokasiUsaha, whatsapp, email, website } = req.body;

  if (!namaBisnis || !bidangUsaha) {
    return res.status(400).json({ error: "Nama Bisnis dan Bidang Usaha harus diisi." });
  }

  const prompt = `
    Bertindaklah sebagai Ahli Digital Marketing, Content Creator, dan Senior Brand Designer.
    Buat rancangan identitas digital premium dan komprehensif untuk bisnis berikut ini:
    - Nama Bisnis: ${namaBisnis}
    - Nama Pendiri/Pribadi: ${namaPribadi || "Tidak disebutkan"}
    - Bidang Usaha/Spesifikasi: ${bidangUsaha}
    - Target Pasar Utama: ${targetPasar || "SME / Pemilik Bisnis Lokal"}
    - Lokasi Usaha: ${lokasiUsaha || "Indonesia"}
    - WhatsApp Kontak: ${whatsapp || "Tidak tersedia"}
    - Email Kontak: ${email || "Tidak tersedia"}
    - Website: ${website || "Tidak tersedia"}

    Tolong buat dokumen branding lengkap dalam format JSON terstruktur dengan properti berikut:
    - suggestedBrandNames: array berisi 3 usulan nama brand premium beserta filosofinya.
    - slogan: usulan 3 jargon/slogan yang catchy dan emosional sesuai target pasar.
    - businessDescription: paragraf deskripsi bisnis profesional dan menyakinkan (150 kata).
    - valueProposition: kalimat utama pembeda kompetitif (brand promise).
    - socialMediaBio: bios sosial media dioptimasi (IG, TikTok, LinkedIn).
    - corporateProfile: deskripsi lengkap profil perusahaan.
    - companyOverview: rangkuman visi & misi.
    - elevatorPitch: kalimat singkat 60-detik untuk memikat investor atau pelanggan potensial.

    Berikan hasil murni dalam JSON terstruktur yang valid.
  `;

  try {
    if (isGeminiAvailable()) {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedBrandNames: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    philosophy: { type: Type.STRING }
                  },
                  required: ["name", "philosophy"]
                }
              },
              slogan: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              businessDescription: { type: Type.STRING },
              valueProposition: { type: Type.STRING },
              socialMediaBio: {
                type: Type.OBJECT,
                properties: {
                  instagram: { type: Type.STRING },
                  tiktok: { type: Type.STRING },
                  linkedin: { type: Type.STRING }
                },
                required: ["instagram", "tiktok", "linkedin"]
              },
              corporateProfile: { type: Type.STRING },
              companyOverview: { type: Type.STRING },
              elevatorPitch: { type: Type.STRING }
            },
            required: [
              "suggestedBrandNames",
              "slogan",
              "businessDescription",
              "valueProposition",
              "socialMediaBio",
              "corporateProfile",
              "companyOverview",
              "elevatorPitch"
            ]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        return res.json(JSON.parse(resultText));
      }
    }

    // High quality intelligent mock generation fallback (Bahasa Indonesia) if Gemini Key not configured
    console.log("No GEMINI_API_KEY detected. Using intelligent localization fallback.");
    const fallbackData = {
      suggestedBrandNames: [
        { name: `${namaBisnis} Digital`, philosophy: `Melambangkan kelincahan teknologi modern dan transformasi digital tak terbatas di era global.` },
        { name: `Artha ${namaBisnis}`, philosophy: `Artha memiliki arti kemakmuran, melambangkan harapan pertumbuhan ekonomi berkelanjutan bagi pendiri brand.` },
        { name: `${namaBisnis} & Co`, philosophy: `Menunjukkan kebersamaan, integritas kustomisasi layanan, dan warisan keahlian yang tepercaya.` }
      ],
      slogan: [
        `Solusi Pintar Bersama ${namaBisnis} untuk Masa Depan Anda.`,
        `Tumbuh Lebih Cepat, Lebih Hebat, dan Berkelanjutan.`,
        `Kemitraan Sejati dengan Dedikasi Terbaik bagi ${targetPasar || "Indonesia"}.`
      ],
      businessDescription: `${namaBisnis} adalah pelopor inovasi di bidang ${bidangUsaha}, berkomitmen penuh menghadirkan kualitas premium bagi seluruh segmen ${targetPasar || "pelanggan"}. Melalui gabungan tim profesional, teknologi modern, dan proses tepercaya, kami meredefinisi standar pasar demi membantu pelanggan mencapai kesuksesan maksimal. Berlokasi di ${lokasiUsaha}, kami bangga melayani dengan sepenuh hati demi kepuasan jangka panjang mitra strategis kami.`,
      valueProposition: `Menjadi mitra akselerasi terdepan di bidang ${bidangUsaha} yang menyajikan keandalan operasional, layanan bernilai tambah tinggi, dan pengalaman digital terpersonalisasi secara transparan.`,
      socialMediaBio: {
        instagram: `✨ Akselerasi Usaha ${bidangUsaha} Anda!\n🚀 Membantu ${targetPasar || "UMKM & Pekerja Kreatif"} tumbuh digital.\n📞 Hubungi WA: ${whatsapp || "-"}\n🌐 Selengkapnya 👇`,
        tiktok: `Bahas tips seru ${bidangUsaha} & branding UMKM 💯\n🔥 Gabung komunitas kami sekarang!\n📍 Terpercaya di ${lokasiUsaha}\nLink bio!`,
        linkedin: `Menghadirkan layanan profesional berkualitas tinggi di industri ${bidangUsaha}. Memajukan kapabilitas identitas brand digital menuju pasar domestik dan global.`
      },
      corporateProfile: `Profil Korporasi Resmi ${namaBisnis}\n\nTelah berkomitmen kokoh sejak berdiri di ${lokasiUsaha} untuk melayani kebutuhan komprehensif di industri ${bidangUsaha}. Kami berfokus pada kualitas pengerjaan, kecepatan respon, dan efisiensi biaya. Mengedepankan integritas profesional, kami memiliki misi jangka panjang untuk menginkubasi identitas brand lokal menyamai standar korporasi internasional.`,
      companyOverview: `Visi:\nMenjadi platform acuan terpercaya nomor satu di bidang ${bidangUsaha} yang menginspirasi ekosistem modern berkelanjutan.\n\nMisi:\n1. Menyediakan bahan baku dan layanan berkualitas unggul secara konsisten.\n2. Memberdayakan pelaku usaha lokal melalui skema integrasi digital.\n3. Mengoptimalkan kepuasan pelanggan lewat dukungan purna jual tercepat.`,
      elevatorPitch: `Halo! Saya ${namaPribadi || "pemilik"} dari ${namaBisnis}. Kami memecahkan masalah besar bagi ${targetPasar || "audiens"} dengan menghadirkan solusi komprehensif ${bidangUsaha}. Berbeda dari opsi konvensional, kami mengantarkan efisiensi hingga 40% dan jaminan kualitas karena teknologi inovatif kami. Boleh saya dapatkan kartu nama atau nomor WA Anda untuk mengirimkan demo proposal singkat kami esok hari?`
    };
    return res.json(fallbackData);
  } catch (error: any) {
    console.error("Branding generator error:", error);
    res.status(500).json({ error: error.message || "Gagal mengolah identitas branding." });
  }
});

// LOGO & COLOUR SCHEME GENERATOR (INTENTIONAL GRAPHICS)
app.post("/api/generate-logo", async (req, res) => {
  const { namaBisnis, sloganUtama, warnaDominan } = req.body;

  if (!namaBisnis) {
    return res.status(400).json({ error: "Nama Bisnis wajib diisi." });
  }

  const prompt = `
    Hubungkan aspek visual dan psikologi warna untuk brand: "${namaBisnis}" dengan slogan "${sloganUtama || ""}".
    Warna dasar yang diinginkan: "${warnaDominan || "Navy & Gold"}".
    Tolong rekomendasikan rancangan Logo profesional beserta petunjuk aplikasinya.
    Keluarkan JSON terstruktur dengan format:
    - hexPalette: array 4 warna HEX primer, sekunder, accent, neutral.
    - suggestionConcept: deskripsi makna filosofi logo itu (100 kata).
    - recommendedTypography: { headingFont: string, bodyFont: string, description: string }
    - logoAssetsDescription: deskripsi spesifik tentang bentuk icon (misal geometri, minimalis daun, inisial huruf).
  `;

  try {
    if (isGeminiAvailable()) {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hexPalette: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              suggestionConcept: { type: Type.STRING },
              recommendedTypography: {
                type: Type.OBJECT,
                properties: {
                  headingFont: { type: Type.STRING },
                  bodyFont: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["headingFont", "bodyFont", "description"]
              },
              logoAssetsDescription: { type: Type.STRING }
            },
            required: ["hexPalette", "suggestionConcept", "recommendedTypography", "logoAssetsDescription"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        return res.json(JSON.parse(resultText));
      }
    }

    // Intelligent Fallback mapping
    let palette = ["#0A192F", "#D4AF37", "#FFFFFF", "#112240"]; // Navy, Gold, White, Dark Slate
    if (warnaDominan === "Merah & Hitam") palette = ["#900C3F", "#FF5733", "#F9F9F9", "#111111"];
    if (warnaDominan === "Hijau & Putih") palette = ["#1b4332", "#40916c", "#f4f9f4", "#2d3142"];
    if (warnaDominan === "Ungu & Royal Gold") palette = ["#4a154b", "#E0AA3E", "#FAFAFA", "#221025"];
    if (warnaDominan === "Modern Teal & Peach") palette = ["#134e5e", "#ffafbd", "#ffffff", "#0d2b31"];

    const fallbackData = {
      hexPalette: palette,
      suggestionConcept: `Konsep logo ini menghubungkan kestabilan formalitas bisnis dengan kemewahan fungsional. Warna utama yang elegan memberi kesan kredibilitas kokoh, sementara sentuhan keemasan memancarkan prestise dan kualitas tanpa batas. Sinar gradasi mengisyaratkan visi masa depan yang cerah dan modern.`,
      recommendedTypography: {
        headingFont: "Cabinet Grotesk / Space Grotesk",
        bodyFont: "Inter / Plus Jakarta Sans",
        description: "Tipografi sans-serif geometris modern berukuran tebal untuk judul utama yang memancarkan ketegasan, dipadukan dengan Inter yang lembut dan seimbang untuk teks bacaan tubuh agar mudah dibaca pada berbagai layar digital."
      },
      logoAssetsDescription: `Mengadaptas bentuk kelopak geometris minimalis yang saling mengikat melingkar, menyerupai gabungan antara lencana modern (badge of trust) dan inisial huruf '${namaBisnis.charAt(0).toUpperCase()}'. Pusat pertemuan simetri dirancang hampa udara untuk mencerminkan adaptabilitas yang dinamis.`
    };
    return res.json(fallbackData);
  } catch (error: any) {
    console.error("Logo generator error:", error);
    res.status(500).json({ error: error.message || "Gagal mengolah generator logo." });
  }
});

// AI CONTENT GENERATOR (BLOG, INSTAGRAM, ADS, TICTOK SCRIPT)
app.post("/api/generate-content", async (req, res) => {
  const { platform, bidangUsaha, topik, gayaBahasa, kataKunci } = req.body;

  if (!platform || !bidangUsaha || !topik) {
    return res.status(400).json({ error: "Platform, Bidang Usaha dan Topik wajib diisi." });
  }

  const prompt = `
    Bertindaklah sebagai Copywriter Profesional, TikTok content specialist, dan Blog Strategist.
    Buat draf tulisan promosi digital dengan pengaturan ini:
    - Platform/Format: ${platform}
    - Industri/Usaha: ${bidangUsaha}
    - Judul/Topik Pembahasan: ${topik}
    - Gaya Bahasa (Tone): ${gayaBahasa || "Edukatif & Persuasif"}
    - Kata Kunci Tambahan yang wajib ada: ${kataKunci || "Terpercaya, Murah, Kualitas Premium"}

    Tulislah output dalam format JSON terstruktur yang berisi:
    - recommendedTitle: Judul yang mengundang rasa ingin tahu (clickbait bersih).
    - primaryHook: Hook 3 detik pertama (kalimat pembuka bombastis).
    - bodyText: Struktur paragraf lengkap yang kaya akan CTA (Call to Action).
    - scriptDialogLines: Jika TikTok/YouTube Script, tuliskan naskah dialog adegan (Scene, Visual, Audio/Voice). Jika Blog/Post, berikan rincian sub-heading penting.
    - hashtags: array berisi 10 hashtag relevan dan viral di Indonesia.
  `;

  try {
    if (isGeminiAvailable()) {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedTitle: { type: Type.STRING },
              primaryHook: { type: Type.STRING },
              bodyText: { type: Type.STRING },
              scriptDialogLines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    scene: { type: Type.STRING },
                    visual: { type: Type.STRING },
                    audio: { type: Type.STRING }
                  },
                  required: ["scene", "visual", "audio"]
                }
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["recommendedTitle", "primaryHook", "bodyText", "scriptDialogLines", "hashtags"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        return res.json(JSON.parse(resultText));
      }
    }

    // Localization robust mock fallback
    const fallbackData = {
      recommendedTitle: `Rahasia Sukses di Bidang ${bidangUsaha}: Jangan Lakukan 3 Kesalahan Fatal Ini!`,
      primaryHook: `Apakah Anda sudah lelah dengan cara konvensional yang tidak menghasilkan penjualan apa pun di industri ${bidangUsaha}? Tonton video ini sampai habis!`,
      bodyText: `Banyak pengusaha pemula terjebak membuang waktu memikirkan hal-hal rumit tanpa membangun kredibilitas dasar. Padahal solusinya sederhana: berfokuslah mengedukasi audiens Anda secara jujur, hadirkan nilai tambah terspesifikasi, dan pastikan proses operasional tepercaya. Jangan biarkan kompetitor Anda melangkah lebih jauh karena Anda menunda upgrade identitas digital.\n\nKlik tautan di profil kami sekarang atau kirim pesan langsung 'SAYA MAU' untuk konsultasi gratis selama 15 menit bersama tim ahli kami hari ini!`,
      scriptDialogLines: [
        {
          scene: "Scene 1 (Intro 0-3s)",
          visual: "Talenta menunjuk layar smartphone dengan ekspresi bingung lalu berubah kaget menatap kamera.",
          audio: "Pernah ga sih kalian ngerasa udah dekorasi toko estetik, tapi ga kunjung ada pembeli yang datang?"
        },
        {
          scene: "Scene 2 (Problem 3-10s)",
          visual: "Close up detail tangan scroll media sosial yang sepi interaksi, menunjukkan grafik anjlok.",
          audio: "Ternyata, masalahnya bukan di produk Anda, melainkan kurangnya sentuhan digital branding tepercaya."
        },
        {
          scene: "Scene 3 (Solution 10-25s)",
          visual: "Talenta tersenyum cerah menunjukkan mock up logo dan feeds Instagram premium di laptop.",
          audio: "Makanya, ubah haluan sekarang! Atur branding kit profesional, pakai warna mewah, dan jadwalkan konten."
        },
        {
          scene: "Scene 4 (Outro/CTA 25-30s)",
          visual: "Talenta melambaikan tangan menunjuk layar dan link WhatsApp yang tertera di bio profil.",
          audio: "Mau dibantu setup otomatis dari nol? Tulis 'BRANDING' di komen, langsung kami kirim detailnya ke DM!"
        }
      ],
      hashtags: [
        `#${bidangUsaha.replace(/\s+/g, "")}`,
        `#BrandingUMKM`,
        `#SaaSPintar`,
        `#KontenViral`,
        `#TikTokMarketing`,
        `#DigitalBranding`,
        `#SolusiBisnis`,
        `#InovasiLokal`,
        `#TipsContentCreator`,
        `#Suksestabungan`
      ]
    };
    return res.json(fallbackData);
  } catch (error: any) {
    console.error("Content generator error:", error);
    res.status(500).json({ error: error.message || "Gagal mengolah generator konten AI." });
  }
});

// MARKETING FUNNEL & EMAIL SEQUENCER GENERATOR
app.post("/api/generate-funnel", async (req, res) => {
  const { namaBisnis, bidangUsaha, targetPasar, leadMagnetType } = req.body;

  const prompt = `
    Rancang skema Marketing Funnel terlengkap secara sistematis untuk bisnis bernama "${namaBisnis}" (${bidangUsaha}) dengan sasaran target "${targetPasar}".
    Kembangkan magnet prospek (lead magnet) tipe: "${leadMagnetType || "Ebook Panduan Gratis"}".
    Tolong kembalikan JSON terstruktur dengan kunci:
    - landingPageHeadline: Judul besar pemicu minat di landing page (CTA fokus).
    - leadMagnetTitle: Nama ebook/event gratis yang ditawarkan sebagai penukar email/WhatsApp.
    - emailSequence: array dari 3 rentetan email otomatis (subject, content, delayInDays).
    - whatsappSequence: array dari 2 baris follow-up pesan instan ramah (tag, message).
    - salesFunnelStages: penjalasan ringkas tahap AIDA (Awareness, Interest, Decision, Action) untuk bisnis ini.
  `;

  try {
    if (isGeminiAvailable()) {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              landingPageHeadline: { type: Type.STRING },
              leadMagnetTitle: { type: Type.STRING },
              emailSequence: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    content: { type: Type.STRING },
                    delayInDays: { type: Type.INTEGER }
                  },
                  required: ["subject", "content", "delayInDays"]
                }
              },
              whatsappSequence: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    tag: { type: Type.STRING },
                    message: { type: Type.STRING }
                  },
                  required: ["tag", "message"]
                }
              },
              salesFunnelStages: {
                type: Type.OBJECT,
                properties: {
                  awareness: { type: Type.STRING },
                  interest: { type: Type.STRING },
                  decision: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["awareness", "interest", "decision", "action"]
              }
            },
            required: ["landingPageHeadline", "leadMagnetTitle", "emailSequence", "whatsappSequence", "salesFunnelStages"]
          }
        }
      });
      const resultText = response.text;
      if (resultText) {
        return res.json(JSON.parse(resultText));
      }
    }

    // Robust Fallback
    const fallbackData = {
      landingPageHeadline: `Bagaimana Meningkatkan Integritas Bisnis ${bidangUsaha} Anda Hingga 3x Lipat Tanpa Menguras Anggaran Iklan!`,
      leadMagnetTitle: `E-Book Eksklusif: 7 Formula Rahasia Akselerasi ${bidangUsaha} yang Sering Dilewatkan 90% Kompetitor Anda.`,
      emailSequence: [
        {
          subject: `🎁 Akses Eksklusif: E-book Rahasia Sukses Anda dari ${namaBisnis}!`,
          content: `Halo, terima kasih banyak telah mengunduh panduan kami! Di e-book ini, kami membahas langkah praktis meningkatkan konversi bisnis Anda. Jika Anda ingin berdiskusi lebih dalam, jadwalkan sesi zoom dengan kami kapan saja.`,
          delayInDays: 0
        },
        {
          subject: `🤔 Mengapa 90% Pelaku Usaha di Bidang ${bidangUsaha} Gagal di Tahun Pertama?`,
          content: `Hai lagi! Kemarin kita sudah membahas strategi awal. Hari ini kami membagikan studi kasus eksklusif bagaimana brand mitra kami di kota Bandung berhasil mengerek pendapatan 250% pasca membenahi skema digital branding.`,
          delayInDays: 2
        },
        {
          subject: `⏰ Kesempatan Terbatas: Diskon 50% Layanan Setup Branding Kit ${namaBisnis}`,
          content: `Halo rekan bisnis! E-book gratis kemarin hanyalah 10% dari apa yang sesungguhnya bisa kami rampungkan bersama Anda. Khusus minggu ini saja, kami menyediakan potongan harga khusus program SaaS onboarding kami.`,
          delayInDays: 4
        }
      ],
      whatsappSequence: [
        {
          tag: "Auto-Reply Selamat Datang (Instan)",
          message: `Halo! Terima kasih telah mengunduh Ebook Gratis dari *${namaBisnis}* 🚀.\n\nBerikut tautan unduhan dokumen PDF Anda: _bit.ly/lead-magnet-download-pdf_.\n\nJika ada pertanyaan mengenai setup ${bidangUsaha}, silakan balas chat ini ya!`
        },
        {
          tag: "Follow-up Hari ke-3",
          message: `Halo kakak, selamat pagi! Semoga kabar bisnisnya sehat selalu 🙏.\n\nHanya ingin bertanya, apakah sempat membaca panduan digital branding kemarin? Kami kebetulan sedang buka 5 slot konsultasi gratis lho untuk UMKM ${bidangUsaha}. Mau dicadangkan 1 slot pagi ini?`
        }
      ],
      salesFunnelStages: {
        awareness: "Menarik perhatian pelaku bsinis via iklan bersponsor dan reels edukasi seputar tips praktis branding.",
        interest: "Menawarkan E-Book gratis sebagai magnet pemicu leads untuk memasukkan data nama dan nomor WhatsApp di landing page.",
        decision: "Memberikan nilai tambah via grup WhatsApp komparasi dan email mengulas studi kasus brand sukses.",
        action: "Menutup transaksi pembelian paket SaaS Starter atau Business menggunakan bonus khusus bonus konsultasi satu-satu."
      }
    };
    return res.json(fallbackData);
  } catch (error: any) {
    console.error("Funnel generator error:", error);
    res.status(500).json({ error: error.message || "Gagal mengolah generator funnel marketing." });
  }
});


// Fallback routing configuration for SPA assets inside Cloud Run
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    // Mount Vite's middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ABDI AUTOMATION] Server matches host 0.0.0.0 & is online on port http://localhost:${PORT}`);
  });
}

startServer();
