export interface Client {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  status: "Active" | "Prospect" | "Lead" | "Inactive";
  segment: string;
  location: string;
  notes: string;
}

export interface BrandingResult {
  suggestedBrandNames: Array<{
    name: string;
    philosophy: string;
  }>;
  slogan: string[];
  businessDescription: string;
  valueProposition: string;
  socialMediaBio: {
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
  corporateProfile: string;
  companyOverview: string;
  elevatorPitch: string;
}

export interface LogoResult {
  hexPalette: string[];
  suggestionConcept: string;
  recommendedTypography: {
    headingFont: string;
    bodyFont: string;
    description: string;
  };
  logoAssetsDescription: string;
}

export interface ContentResult {
  recommendedTitle: string;
  primaryHook: string;
  bodyText: string;
  scriptDialogLines: Array<{
    scene: string;
    visual: string;
    audio: string;
  }>;
  hashtags: string[];
}

export interface FunnelResult {
  landingPageHeadline: string;
  leadMagnetTitle: string;
  emailSequence: Array<{
    subject: string;
    content: string;
    delayInDays: number;
  }>;
  whatsappSequence: Array<{
    tag: string;
    message: string;
  }>;
  salesFunnelStages: {
    awareness: string;
    interest: string;
    decision: string;
    action: string;
  };
}

// Complete SaaS Deliverables Text Content (Dokumentasi Resmi)
export const SaaS_Deliverables = {
  folderStructure: `
ABDI AUTOMATION - STANDAR STRUKTUR FLDR PRODUKSI
============================================================

/abdi-automation
├── /assets                      # Static assets, branding presets, and illustrations
├── /dist                        # Main production build outputs compiled for Cloud Run
│   ├── /assets                  # Compiled CSS and optimized React chunks
│   ├── index.html               # Production HTML entrypoint
│   └── server.cjs               # Compiled self-contained back-end server (esbuild commonJS)
├── /src                         # Frontend React TypeScript Source Code
│   ├── /components              # Modularized UI Tabs
│   │   ├── AnalyticsTab.tsx     # CRM Data & Real-time SVG Traffic / Leads Graph
│   │   ├── BrandingTab.tsx      # Comprehensive AI profile, company overview & pitch
│   │   ├── CalendarTab.tsx      # Social editorial calendar manager
│   │   ├── ContentTab.tsx       # Multiplatform AI content copy & scripts
│   │   ├── CRMTab.tsx           # Multi-role customer database list and editor
│   │   ├── DocTab.tsx           # Technical specifications and Indonesian manual view
│   │   ├── FunnelTab.tsx        # Funnel builder, lead magnet & sequence automations
│   │   ├── LogoTab.tsx          # Real-time SVG custom visual generator + brand guides
│   │   ├── PosterTab.tsx        # Multidimensional ad poster canvas canvas editor
│   │   └── WhatsAppTab.tsx      # Simulated WA API broadcasting & chat simulation
│   ├── /data                    # Static guidelines files and predefined datasets
│   ├── App.tsx                  # Primary view router and role selector
│   ├── index.css                # Tailwind global styles sheet with custom fonts
│   ├── main.tsx                 # Frontend Mount Core
│   └── types.ts                 # TypeScript type schemas and deliverables text DB
├── .env.example                 # Template for required cloud credentials (key)
├── .gitignore                   # Safe path exclusions (node_modules, token secrets)
├── metadata.json                # App permission scope declaration 
├── package.json                 # Dependency rules and server bundling directives
├── server.ts                    # Express backend entry point managing middleware in dev
├── tsconfig.json                # TS environment parameters
└── vite.config.ts               # Vite bundler, proxy configuration & HMR setup
`,

  databaseSchema: `
-- POSTGRESQL PRODUCTION DATABASE SCHEMA SPECIFICATION
-- Database Platform: Google Cloud SQL (PostgreSQL v15+)
-- Client Auth: Firebase Auth integrated UID

-- Enable uuid extension for secure primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Users (Roles, Subscriptions & Core Identity)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(30) DEFAULT 'client' CHECK (role IN ('super_admin', 'admin', 'client')),
    package_tier VARCHAR(50) DEFAULT 'free' CHECK (package_tier IN ('free', 'starter', 'basic', 'professional', 'business')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: BrandIdentities (Output of Branding Generator)
CREATE TABLE brand_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    owners_name VARCHAR(255),
    sector VARCHAR(150) NOT NULL,
    target_market TEXT,
    location VARCHAR(150),
    whatsapp_number VARCHAR(30),
    email_contact VARCHAR(255),
    website_url VARCHAR(255),
    company_bio TEXT,
    slogan VARCHAR(255),
    value_proposition TEXT,
    elevator_pitch TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: BrandColorKits (Design aesthetics and guidelines)
CREATE TABLE brand_color_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brand_identities(id) ON DELETE CASCADE,
    primary_color VARCHAR(10) NOT NULL,
    secondary_color VARCHAR(10) NOT NULL,
    accent_color VARCHAR(10),
    neutral_color VARCHAR(10),
    heading_font VARCHAR(100),
    body_font VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: CRM_Clients (Admin-Client Managed Contacts Database)
CREATE TABLE crm_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    managed_by UUID REFERENCES users(id) ON DELETE CASCADE,
    client_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    status VARCHAR(30) DEFAULT 'Lead' CHECK (status IN ('Active', 'Prospect', 'Lead', 'Inactive')),
    segment VARCHAR(100),
    location VARCHAR(100),
    interaction_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Content_Calendar_Schedules (Automated Social Calendars)
CREATE TABLE content_calendar_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brand_identities(id) ON DELETE CASCADE,
    scheduled_day VARCHAR(20) NOT NULL,
    post_type VARCHAR(50) NOT NULL,
    content_topic TEXT NOT NULL,
    caption_draft TEXT,
    cta_link VARCHAR(255),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`,

  erd: `
ABDI AUTOMATION - RELATIONAL ENTITY RELATIONSHIP DIAGRAM (ERD)
========================================================================

                 [ USERS ] (Multi-tiered Roles)
                     |
                     | 1 : N (Cascade)
                     +----------------------------------------+
                     |                                        |
            [ BRAND_IDENTITIES ]                        [ CRM_CLIENTS ]
                     |                               (Managed SME Profiles)
         +-----------+-----------+
         | 1 : 1                 | 1 : N
  [ BRAND_COLOR_KITS ]   [ CONTENT_CALENDAR_SCHEDULES ]
 (GUI Palette & Typography) (Automated Editorial Calendar)

Keterangan Kardinalitas:
- Satu User (SaaS Client) dapat mendaftarkan beberapa Brand Identities (1:N).
- Setiap Brand Identity terhubung langsung ke tepat satu Brand Color Kit (1:1).
- Setiap Brand Identity dapat memicu rencana Content Calendar bulanan yang tak terbatas (1:N).
- Pihak Admin / Super Admin (Owner SaaS) mengawasi seluruh relasi tabel User & CRM_Clients global.
`,

  apiDocumentation: `
DOKUMENTASI REST API RESMI - ABDI AUTOMATION
==========================================================

1. AUTHENTICATION & ACCESS (Firebase Proxy)
   Secara default, client-side React melampirkan header "Authorization: Bearer <ID_TOKEN>"
   yang diverifikasi server-side menggunakan Firebase Admin SDK.

2. API ENDPOINTS (Backend Host: Port 3000)

   A. BRANDING GENERATOR
      - URL: POST /api/generate-branding
      - Content-type: application/json
      - Request Body:
        {
          "namaBisnis": "string (Required)",
          "namaPribadi": "string",
          "bidangUsaha": "string (Required)",
          "targetPasar": "string",
          "lokasiUsaha": "string",
          "whatsapp": "string",
          "email": "string",
          "website": "string"
        }
      - Response (JSON 200 Ok):
        {
          "suggestedBrandNames": [{"name": "...", "philosophy": "..."}],
          "slogan": ["slogan 1", "slogan 2"],
          "businessDescription": "...",
          "valueProposition": "...",
          "socialMediaBio": {"instagram": "...", "tiktok": "...", "linkedin": "..."},
          "corporateProfile": "...",
          "companyOverview": "...",
          "elevatorPitch": "..."
        }

   B. LOGO & BRAND KIT CONFIGURATION
      - URL: POST /api/generate-logo
      - Request Body:
        {
          "namaBisnis": "string (Required)",
          "sloganUtama": "string",
          "warnaDominan": "string (e.g. Navy & Gold)"
        }
      - Response (JSON 200 Ok):
        {
          "hexPalette": ["#0A192F", "#D4AF37", ...],
          "suggestionConcept": "...",
          "recommendedTypography": { "headingFont": "...", "bodyFont": "...", "description": "..." },
          "logoAssetsDescription": "..."
        }

   C. AI CONTENT GENERATOR
      - URL: POST /api/generate-content
      - Request Body:
        {
          "platform": "Instagram Post | TikTok Script | Blog Article",
          "bidangUsaha": "string",
          "topik": "string",
          "gayaBahasa": "string",
          "kataKunci": "string"
        }
      - Response (JSON 200 Ok):
        {
          "recommendedTitle": "...",
          "primaryHook": "...",
          "bodyText": "...",
          "scriptDialogLines": [{"scene": "...", "visual": "...", "audio": "..."}],
          "hashtags": ["#tag1", "#tag2"]
        }

   D. CRM CLIENT CRUD MANAGEMENT
      - URL: GET /api/crm/clients -> Mengembalikan seluruh client terdaftar.
      - URL: POST /api/crm/clients -> Membuat client baru.
      - URL: PUT /api/crm/clients/:id -> Update data client.
      - URL: DELETE /api/crm/clients/:id -> Menghapus data client secara permanen.
`,

  deploymentGuide: `
PANDUAN PENYEBARAN (DEPLOYMENT GUIDE) - GOOGLE CLOUD RUN
======================================================
Sistem ini menggunakan kontainer mandiri Express.js + Vite untuk efisiensi instan di Cloud Run.

Langkah-Langkah:
1. Prasyarat Lokal: Pastikan Docker & Google Cloud CLI sudah terinstal.
2. Inisiasi GCloud:
   $ gcloud auth login
   $ gcloud config set project [ID_PROJEK_ANDA]
3. Lakukan Build Kontainer via Cloud Build:
   $ gcloud builds submit --tag gcr.io/[ID_PROJEK_ANDA]/ai-branding-automation
4. Sebarkan Kontainer ke Cloud Run:
   $ gcloud run deploy ai-branding-automation \\
       --image gcr.io/[ID_PROJEK_ANDA]/ai-branding-automation \\
       --platform managed \\
       --region asia-southeast1 \\
       --allow-unauthenticated \\
       --port 3000 \\
       --set-env-vars "NODE_ENV=production,GEMINI_API_KEY=[API_KEY_KAMU]"
5. Integrasi Selesai: Cloud Run akan membagikan tautan https:// resmi tempat aplikasi SaaS siap diakses publik.
`,

  userManual: `
USER MANUAL / PANDUAN PENGGUNA (UNTUK CLIENT / UMKM)
===================================================

Selamat datang di ABDI AUTOMATION! Layanan asisten mandiri identitas Anda.

Langkah Cepat Membangun Brand Anda:
1. LOGIN & PILIH PERAN: Buka dashboard kita, pastikan sudut kanan atas terpilih sebagai "Client".
2. BRANDING GENERATOR: Isi nama, profil pendiri, bidang bisnis Anda di tab pertama. Klik "Proses Identitas AI". AI akan langsung merancang slogan, elevator pitch, dan value proposition yang sangat persuasif.
3. LOGO & BRAND KIT: Masuk ke tab "Logo Generator". Pilih warna dominan (misal Navy & Gold). Klik "Buat Skema Logo". Generator akan otomatis memunculkan Mockup Logo SVG, 4 variasi warna, serta rekomendasi tipografi modern yang bisa di-copy. Anda bisa men-download SVG-nya langsung!
4. SOCIAL MEDIA SETUP: Gunakan panduan checklist di tab "Social Media" untuk membuat akun FB, TikTok, IG baru dengan username & deskripsi profil rekomendasi AI.
5. AI CONTENT & POSTER CREATOR: Pilih tone (Edukatif/Persuasif), buat postingan promosi otomatis. Di tab Poster, atur teks, warna dominan, lalu download poster promosi siap tampil!
6. WA & CRM: Kelola prospek penjualan masuk di tab Database CRM dan siapkan auto-reply FAQ di kolom WhatsApp Marketing. Rencanakan pemasaran harian dengan kalender konten terintegrasi.
`,

  adminManual: `
ADMIN & SUPER ADMIN MANUAL (PANDUAN OPERASIONAL INTERNAL)
========================================================

Panduan khusus admin untuk mengelola stabilitas platform SaaS dan melayani pelanggan:

1. MANAJEMEN USER (ROLE SUPER ADMIN / OWNER SAAS)
   - Super Admin memantau efisiensi keuangan di tab Dashboard Analytics secara global.
   - Mengalihkan pendaftaran paket Starter (Rp100rb) hingga Business (Rp500rb) serta menyaring kuota generasi AI per pengguna.
   - Melakukan penangguhan akses akun (suspend) jika mendeteksi spam/abuse penulisan konten sara/politik pada Gemini API.

2. MANAJEMEN DATABASE PELANGGAN (ADMIN)
   - Memasuki Dashboard, ganti Peran Perilaku di kanan atas menjadi "Admin" atau "Super Admin".
   - Buka tab "Database CRM". Di sini, Anda memiliki wewenang mengedit data profil usaha milik klien (Client), mencatat interaksi WhatsApp, menandai status prospek ("Active", "Prospect", "Lead"), atau menghapus data jika terjadi duplikasi kontak.
   - Gunakan filter Segmentasi F&B / Fashion untuk menganalisis basis industri tersukses klien Anda.
`,

  securityBestPractices: `
KEBIJAKAN & SECURITY BEST PRACTICES (KEAMANAN PREMIUM)
=====================================================

1. PERLINDUNGAN API KEY GEMINI
   - API key TIDAK BOLEH dikirimkan atau diparsing di sisi browser client. Seluruh koneksi AI harus melekat di runtime server.ts via server-side 'process.env.GEMINI_API_KEY'.
   
2. VALIDASI INPUT & ANTI-PROMPT INJECTION
   - Server membatasi panjang teks field maksimal 500 karakter untuk mencegah eksploitasi tokens (prompt injection) oleh user nakal yang mencoba mencuri akses Gemini di balik layar.
   
3. ENKRIPSI DATA & STORAGE SECURITY
   - Seluruh payload CRM terlindungi di enkripsi SSL/TLS HTTPS saat komunikasi API.
   - Pemanfaatan Firebase Rules mewajibkan relasi kepemilikan data (managed_by === auth.uid) untuk meyakinkan database klien tidak bisa dibobol pengguna lain.
`
};
