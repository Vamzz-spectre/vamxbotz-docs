"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BotStatusWidget } from "@/components/BotStatusWidget";
import { BotImageStack } from "@/components/BotImageStack";
import { FeedbackModal } from "@/components/FeedbackModal";
import { Footer } from "@/components/Footer";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { botInfo } from "@/data/bot-info";
import {
  Search,
  Shield,
  Zap,
  Download,
  Bot,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Terminal,
  Send,
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Top highlight pillars for home page (Curated, not a bloated dump)
  const coreHighlights = [
    {
      icon: Shield,
      title: "Proteksi & Moderasi Grup",
      description:
        "Jaga ketertiban grup WhatsApp dengan proteksi anti-link otomatis, auto-kick spammer, pembersih chat, dan salam penyambutan interaktif.",
      badge: "Keamanan 24 Jam",
      color: "emerald",
      commandPreview: ".antilink on • .hidetag • .kick",
      link: "/fitur#group-management",
    },
    {
      icon: Download,
      title: "Downloader Media Super Cepat",
      description:
        "Unduh video TikTok tanpa watermark, Instagram Reels & Carousel, audio YouTube 320kbps, dan lagu Spotify berkualitas tinggi tanpa jeda.",
      badge: "Kualitas 1080p",
      color: "pink",
      commandPreview: ".tiktok [url] • .ig • .ytmp3",
      link: "/fitur#downloader-hd",
    },
    {
      icon: Zap,
      title: "Broadcast JPM & Push Kontak",
      description:
        "Otomatisasi promosi massal ke ratusan grup dan ribuan kontak dengan Smart Anti-Ban Delay untuk menjaga keamanan akun WhatsApp Anda.",
      badge: "Khusus Pebisnis",
      color: "amber",
      commandPreview: ".pushkontak • .jpm • .savecontact",
      link: "/fitur#marketing-jpm",
    },
    {
      icon: Bot,
      title: "Asisten AI Cerdas & Voice",
      description:
        "Tanya jawab seputar materi pelajaran, coding website, pembuatan artikel, hingga voice note realistis bertenaga GPT-4o dan Gemini 1.5.",
      badge: "GPT-4o & Gemini",
      color: "purple",
      commandPreview: ".ai [tanya] • .gemini • .tts",
      link: "/fitur#ai-intelligence",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Navbar onOpenFeedback={() => setIsFeedbackOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 border-b border-zinc-900 bg-radial-[at_50%_0%] from-emerald-950/40 via-zinc-950 to-zinc-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Version badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-8 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dokumentasi Resmi &bull; {botInfo.name} v{botInfo.version}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Asisten WhatsApp Cerdas, Tangguh &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Siap 24 Jam
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed font-normal">
            Solusi otomasi grup WhatsApp modern untuk moderasi komunitas, unduh video HD tanpa
            watermark, siaran promosi JPM massal, serta asisten AI bertenaga tinggi.
          </p>

          {/* Primary Action Buttons (Clean & Focused, NO Admin Link) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
            <Link
              href="/sewa"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Sewa Bot Sekarang (Rp 15rb/bln)</span>
            </Link>

            <Link
              href="/fitur"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-zinc-900 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Jelajahi Fitur Lengkap</span>
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </Link>
          </div>

          {/* Quick Search Shortcut */}
          <div className="max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/fitur?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                placeholder="Cari perintah (misal: antilink, ttdl, pushkontak)..."
                className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800/80 pl-11 pr-24 py-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xl"
              />
              <Link
                href={`/fitur${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`}
                className="absolute right-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-750 transition-colors"
              >
                Cari
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-20">
        {/* 1. Realtime Bot & Server Status Widget */}
        <BotStatusWidget />

        {/* 2. Interactive 3D Stacked Preview Slider (Model Numpuk) */}
        <BotImageStack />

        {/* 3. Core Pillars / Curated Feature Highlights */}
        <section className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
                Kategori Unggulan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Dirancang untuk Produktivitas Grup & Bisnis
              </h2>
            </div>

            <Link
              href="/fitur"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 group self-start sm:self-auto"
            >
              <span>Buka Seluruh 80+ Perintah di Page Fitur</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreHighlights.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm hover:border-zinc-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                    <code className="text-[11px] font-mono text-emerald-400/90 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                      {feat.commandPreview}
                    </code>

                    <Link
                      href={feat.link}
                      className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 group-hover:text-emerald-400 transition-colors"
                    >
                      <span>Detail</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Why Choose VamxBotz Benefits */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Keunggulan Sistem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mengapa Memilih VamxBotz?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/30">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">Server Aktif 24 Jam</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dihosting di VPS Cloud berkecepatan tinggi dengan uptime 99.9%. Grup Anda tetap
                terjaga tanpa perlu HP Anda menyala.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-4 border border-amber-500/30">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">Smart Anti-Ban Delay</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sistem pengiriman broadcast dan push kontak dilengkapi algoritma jeda cerdas agar
                nomor WhatsApp tetap aman dan terhindar dari suspend.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white mb-1.5">Respon Cepat di Bawah 1 Detik</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dibangun menggunakan Node.js dan Baileys Multi-Device yang dioptimasi untuk
                mengeksekusi perintah seketika tanpa antrean panjang.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Jasa Sewa Call-to-Action Banner */}
        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold inline-block">
              💰 Penawaran Jasa Sewa Bot
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ingin Menambahkan VamxBotz ke Grup WhatsApp Anda?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Mulai dari <strong>Rp 15.000 / bulan</strong>, nikmati kemudahan proteksi anti-link 24
              jam, hidetag unlimited, download video tanpa watermark, dan broadcast promosi otomatis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              href="/sewa"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-center"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Lihat Paket Sewa</span>
            </Link>

            <a
              href={`https://wa.me/${botInfo.ownerNumber}?text=Halo%20kak%20Vamz,%20saya%20tertarik%20sewa%20bot%20WhatsApp`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-700 hover:bg-zinc-800 transition-all text-center"
            >
              <Send className="h-4 w-4" />
              <span>Chat Owner</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
