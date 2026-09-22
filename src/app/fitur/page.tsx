"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeedbackModal } from "@/components/FeedbackModal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { botInfo } from "@/data/bot-info";
import {
  Shield,
  Zap,
  Download,
  Bot,
  Sparkles,
  BookOpen,
  Terminal,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Flame,
} from "lucide-react";

interface FeatureDetail {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  badge: string;
  accentColor: string;
  items: {
    command: string;
    name: string;
    description: string;
  }[];
  highlights: string[];
}

const detailedFeatures: FeatureDetail[] = [
  {
    id: "group-management",
    icon: Shield,
    title: "Manajemen Grup & Keamanan Terpadu",
    tagline: "Kontrol penuh atas komunitas WhatsApp Anda dengan sistem pertahanan dan automasi cerdas.",
    badge: "Keamanan 24/7",
    accentColor: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30",
    items: [
      {
        command: ".antilink on/off",
        name: "Sistem Anti-Link Otomatis",
        description: "Mendeteksi link grup lain secara instan, menghapus chat, dan mengeluarkan spammer.",
      },
      {
        command: ".hidetag [pesan]",
        name: "Hidetag & Tagall",
        description: "Tag seluruh anggota grup tanpa daftar tag panjang yang mengotori layar.",
      },
      {
        command: ".welcome & .goodbye",
        name: "Penyambutan Otomatis",
        description: "Kirim sambutan ramah dengan kartu visual kepada anggota baru yang bergabung.",
      },
      {
        command: ".kick @user / .promote @user",
        name: "Moderasi Cepat Sekali Ketik",
        description: "Keluarkan anggota melanggar atau jadikan admin tanpa membuka info grup.",
      },
    ],
    highlights: ["Bypass khusus admin", "Proteksi spam chat anti-lag", "Pembersih pesan otomatis (.delete)"],
  },
  {
    id: "marketing-jpm",
    icon: Zap,
    title: "JPM & Push Kontak (Broadcast Pemasaran)",
    tagline: "Perluas jangkauan bisnis Anda ke ratusan grup dan ribuan kontak dengan proteksi anti-ban.",
    badge: "Khusus Seller & Pebisnis",
    accentColor: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30",
    items: [
      {
        command: ".pushkontak [teks] | delay: 5",
        name: "Push Kontak Massal Grup",
        description: "Mengirimkan pesan promosi ke seluruh kontak anggota grup secara bertahap.",
      },
      {
        command: ".jpm [teks/media]",
        name: "Jalur Promosi Massal (JPM)",
        description: "Kirim pengumuman jualan ke semua grup yang dimasuki bot secara otomatis.",
      },
      {
        command: ".savecontact",
        name: "Ekspor Kontak Grup",
        description: "Simpan nomor anggota grup ke dalam file VCF untuk database pelanggan.",
      },
    ],
    highlights: ["Smart delay 3-10 detik", "Dukungan lampiran gambar/video", "Laporan status pengiriman realtime"],
  },
  {
    id: "downloader-hd",
    icon: Download,
    title: "Downloader Media Multi-Platform",
    tagline: "Unduh konten video dan audio dari berbagai platform favorit tanpa jeda iklan dan tanpa watermark.",
    badge: "Kualitas Asli 1080p",
    accentColor: "from-pink-500/20 to-rose-500/5 text-pink-400 border-pink-500/30",
    items: [
      {
        command: ".tiktok [url]",
        name: "TikTok HD No Watermark",
        description: "Unduh video TikTok jernih serta ekstrak sound originalnya secara terpisah.",
      },
      {
        command: ".ig / .reels [url]",
        name: "Instagram Post & Reels",
        description: "Download reels, carousel foto, serta video IG TV dalam resolusi terbaik.",
      },
      {
        command: ".ytmp3 & .ytmp4 [url]",
        name: "YouTube Audio & Video",
        description: "Konversi video YouTube menjadi lagu MP3 320kbps atau video MP4 tajam.",
      },
      {
        command: ".spotify [judul/url]",
        name: "Spotify Music Search",
        description: "Cari lagu dan unduh file audio langsung ke ruang percakapan WhatsApp Anda.",
      },
    ],
    highlights: ["Server downloader dedicated", "Resolusi tinggi tanpa kompresi kasar", "Dukungan Pinterest & Twitter/X"],
  },
  {
    id: "ai-intelligence",
    icon: Bot,
    title: "Kecerdasan Buatan (AI Chat & Coding)",
    tagline: "Asisten cerdas bertenaga model AI terkini untuk membantu tugas, riset, dan produktivitas Anda.",
    badge: "GPT-4o & Gemini 1.5",
    accentColor: "from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/30",
    items: [
      {
        command: ".ai [pertanyaan]",
        name: "Tanya Jawab GPT Pintar",
        description: "Tanyakan apapun, mulai dari materi pelajaran, resep masakan, hingga ide kreatif.",
      },
      {
        command: ".gemini [teks]",
        name: "Google Gemini 1.5 Pro",
        description: "Model AI penalaran mendalam untuk riset teknis dan analisis dokumen panjang.",
      },
      {
        command: ".aicoder [instruksi]",
        name: "Coding Assistant Cerdas",
        description: "Bantu perbaiki bug, buat script bot, SQL query, atau fungsi web dalam hitungan detik.",
      },
    ],
    highlights: ["Konteks percakapan mengalir", "Jawaban terformat rapi", "Respon ultra-cepat di bawah 1 detik"],
  },
  {
    id: "sticker-converter",
    icon: Sparkles,
    title: "Pembuat Stiker & Converter Audio",
    tagline: "Koleksi tools kreatif untuk membuat stiker WhatsApp keren, konversi media, dan efek suara unik.",
    badge: "Desain Suka-Suka",
    accentColor: "from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/30",
    items: [
      {
        command: ".s / .sticker (reply foto)",
        name: "Pembuat Stiker WhatsApp",
        description: "Ubah foto atau video pendek menjadi stiker bergerak (GIF) maupun statis.",
      },
      {
        command: ".toimg (reply stiker)",
        name: "Stiker ke Gambar / Foto",
        description: "Konversi stiker kembali menjadi foto resolusi penuh untuk disimpan di galeri.",
      },
      {
        command: ".tts [bahasa] [teks]",
        name: "Text-to-Speech Voice",
        description: "Ubah tulisan menjadi pesan suara voice note mirip suara manusia alami.",
      },
      {
        command: ".tovn & .tomp3",
        name: "Audio & VN Converter",
        description: "Ekstrak audio dari video menjadi Voice Note WhatsApp atau file MP3 murni.",
      },
    ],
    highlights: ["Paket stiker ber-watermark nama sendiri", "Anti-crop auto center", "Berbagai filter audio bass/nightcore"],
  },
  {
    id: "school-reminders",
    icon: BookOpen,
    title: "Pengingat Kelas & Utilitas Sekolah",
    tagline: "Membantu pelajar dan mahasiswa mengatur jadwal, tugas, dan deadline agar tidak tertinggal.",
    badge: "Solusi Grup Kelas",
    accentColor: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30",
    items: [
      {
        command: ".jadwal / .listjadwal",
        name: "Daftar Mata Kuliah / Pelajaran",
        description: "Tampilkan susunan mata pelajaran grup hari ini secara teratur.",
      },
      {
        command: ".tugas & .remind",
        name: "Pengingat Tugas Otomatis",
        description: "Notifikasi otomatis dari bot sebelum batas waktu pengumpulan tugas berakhir.",
      },
      {
        command: ".kalkulator [rumus]",
        name: "Hitung Cepat Matematika",
        description: "Selesaikan persamaan matematika langsung di grup tanpa aplikasi kalkulator luar.",
      },
    ],
    highlights: ["Notifikasi terjadwal harian", "Bisa diedit oleh ketua kelas", "Mendukung timezone WIB/WITA/WIT"],
  },
];

export function FiturPage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredFeatures =
    activeTab === "all" ? detailedFeatures : detailedFeatures.filter((f) => f.id === activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Navbar onOpenFeedback={() => setIsFeedbackOpen(true)} />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20 border-b border-zinc-900 bg-radial-[at_50%_0%] from-emerald-950/40 via-zinc-950 to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            Fitur Lengkap VamxBotz WhatsApp
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Satu Bot WhatsApp untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Segala Kebutuhan Anda
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed">
            Didesain khusus untuk efisiensi tinggi, keamanan grup, otomasi broadcast promosi, dan
            kecepatan download tanpa jeda.
          </p>

          {/* Quick Counter Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                <AnimatedCounter value={80} suffix="+" />
              </span>
              <span className="text-xs text-zinc-400">Total Perintah Bot</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400 block">
                <AnimatedCounter value={99} suffix=".9%" />
              </span>
              <span className="text-xs text-zinc-400">Uptime Server</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-cyan-400 block">
                <AnimatedCounter value={6} suffix=" Modul" />
              </span>
              <span className="text-xs text-zinc-400">Kategori Utama</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-400 block">
                &lt; 0.8s
              </span>
              <span className="text-xs text-zinc-400">Respon Eksekusi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Semua Modul Fitur
          </button>
          {detailedFeatures.map((feat) => {
            const Icon = feat.icon;
            const isActive = activeTab === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{feat.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Sections Grid */}
        <div className="space-y-12">
          {filteredFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Glow highlight */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8 pb-6 border-b border-zinc-800/80">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-full border mb-2 bg-emerald-950/60 border-emerald-800/60 text-emerald-400">
                        {feat.badge}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {feat.title}
                      </h2>
                      <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                        {feat.tagline}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`https://wa.me/${botInfo.ownerNumber}?text=Halo%20kak%20Vamz,%20saya%20tertarik%20dengan%20fitur%20${encodeURIComponent(
                      feat.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all self-start lg:self-auto"
                  >
                    <span>Tanya Fitur Ini</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </Link>
                </div>

                {/* Sub Features Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {feat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-zinc-100">{item.name}</span>
                        <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                          {item.command}
                        </code>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-zinc-500 font-medium">Keunggulan:</span>
                  {feat.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bottom Banner */}
        <div className="mt-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Siap Menghadirkan VamxBotz ke Grup Anda?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Dapatkan kenyamanan grup yang terlindungi, download media tanpa ribet, serta promosi massal
              dengan paket sewa bot terjangkau mulai dari Rp 15.000 / bulan.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/sewa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Lihat Pilihan Paket Sewa</span>
              </Link>
              <Link
                href="/#commands"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <span>Lihat Seluruh 80+ Perintah</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}

export default FiturPage;
