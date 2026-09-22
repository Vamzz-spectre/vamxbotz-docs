"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeedbackModal } from "@/components/FeedbackModal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { botInfo } from "@/data/bot-info";
import {
  Check,
  Shield,
  Zap,
  Crown,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Clock,
  ArrowRight,
  Send,
  MessageCircle,
  Flame,
  Star,
  ChevronDown,
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  priceMonthly: number;
  periodLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  notIncluded?: string[];
  ctaText: string;
  ctaPrefill: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "standar",
    name: "Paket Standar Grup",
    badge: "Paling Hemat",
    priceMonthly: 15000,
    periodLabel: "Per Grup / Bulan",
    description: "Sempurna untuk grup sekolah, mabar games, tongkrongan, dan komunitas santai.",
    icon: Shield,
    features: [
      "Proteksi Anti-Link Grup Lain (Auto-Kick)",
      "Hidetag & Tagall Tanpa Batas",
      "Penyambutan Welcome & Goodbye Otomatis",
      "Pembuat Stiker Foto & Video GIF",
      "Downloader TikTok HD & IG Reels",
      "Bot Online 24/7 Tanpa Perlu Hosting Sendiri",
      "Garansi Aktif & Backup Server",
    ],
    notIncluded: ["Fitur JPM Promosi Massal", "Fitur Push Kontak Anggota", "Custom Nama & Foto Bot"],
    ctaText: "Sewa Paket Standar",
    ctaPrefill:
      "Halo kak Vamz Spectre, saya ingin sewa bot *Paket Standar Grup (Rp 15.000/bln)* untuk grup WhatsApp saya. Mohon infokan metode pembayarannya.",
  },
  {
    id: "pro",
    name: "Paket Pro Bisnis & JPM",
    badge: "Paling Diminati ⭐",
    isPopular: true,
    priceMonthly: 30000,
    periodLabel: "Per Grup / Bulan",
    description: "Pilihan terbaik untuk penjual online, grup JB / store, dan promosi massal aman.",
    icon: Zap,
    features: [
      "Semua Fitur Paket Standar Grup",
      "JPM (Jalur Promosi Massal) ke Seluruh Grup",
      "Push Kontak Massal Anggota Grup (Anti-Ban Safe Delay)",
      "Ekspor Kontak Grup ke Format File VCF",
      "Downloader Tanpa Batas (TikTok, IG, YouTube, Spotify)",
      "Akses Penuh AI Pintar (GPT-4o & Gemini Unmetered)",
      "Prioritas Bandwidth Server Anti-Lag",
      "Customer Support Langsung dari Vamz Spectre",
    ],
    ctaText: "Sewa Paket Pro Bisnis",
    ctaPrefill:
      "Halo kak Vamz Spectre, saya ingin sewa bot *Paket Pro Bisnis & JPM (Rp 30.000/bln)*. Mohon infokan rekening/QRIS untuk pembayaran.",
  },
  {
    id: "vip",
    name: "Paket VIP Custom Bot",
    badge: "Eksklusif & Full Akses",
    priceMonthly: 50000,
    periodLabel: "Per Nomor / Bulan",
    description: "Gunakan nomor WhatsApp Anda sendiri, bebas pasang ke grup manapun tanpa batasan.",
    icon: Crown,
    features: [
      "Gunakan Nomor WhatsApp Milik Anda Sendiri (Pairing Code)",
      "Bebas Ganti Nama Bot, Bio, & Foto Profil Sesuai Brand",
      "Bebas Masukkan Bot ke Banyak Grup Tanpa Batas Grup",
      "Akses Menu Owner Penuh (.mode, .restart, .eval)",
      "Watermark Stiker Menggunakan Nama Pribadi/Olshop",
      "Semua Fitur AI, Downloader, JPM & Push Kontak Aktif",
      "Bimbingan & Setting Lengkap Dibantu Sampai Jalan",
      "Garansi Pergantian Sesi jika Nomor Terlogout",
    ],
    ctaText: "Sewa Paket VIP Custom",
    ctaPrefill:
      "Halo kak Vamz Spectre, saya tertarik sewa bot *Paket VIP Custom Bot (Rp 50.000/bln)* dengan nomor sendiri. Mohon panduan cara aktivasinya.",
  },
];

const faqs = [
  {
    q: "Berapa lama proses bot dimasukkan setelah pembayaran?",
    a: "Proses aktivasi sangat cepat, rata-rata hanya 1-5 menit setelah bukti transfer dikonfirmasi. Anda cukup kirimkan link tautan grup yang ingin dimasuki bot.",
  },
  {
    q: "Metode pembayaran apa saja yang diterima?",
    a: "Kami menerima seluruh pembayaran Indonesia: QRIS All Payment (bisa scan dari BCA, BRI, Mandiri, BNI, Dana, GoPay, OVO, ShopeePay, LinkAja) serta Transfer Bank langsung.",
  },
  {
    q: "Apakah bot aktif 24 jam non-stop?",
    a: "Ya! Bot dihosting pada VPS Cloud berkecepatan tinggi dengan uptime 99.9%. Anda tidak perlu menyalakan HP atau laptop Anda.",
  },
  {
    q: "Bagaimana jika bot mengalami kendala atau mati?",
    a: "Kami memberikan garansi masa aktif penuh! Jika terjadi kendala maintenance server, durasi sewa Anda akan ditambahkan kompensasi secara cuma-cuma.",
  },
  {
    q: "Apakah push kontak aman dari pemblokiran (banned) WhatsApp?",
    a: "Sistem push kontak di VamxBotz dilengkapi fitur Smart Anti-Ban Delay (jeda otomatis 3-10 detik antar kontak) sehingga sangat aman digunakan jika sesuai panduan.",
  },
];

export function SewaPage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Navbar onOpenFeedback={() => setIsFeedbackOpen(true)} />

      {/* Hero Pricing Header */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 border-b border-zinc-900 bg-radial-[at_50%_0%] from-emerald-950/40 via-zinc-950 to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Layanan Resmi Jasa Sewa Bot WhatsApp
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Sewa Bot WhatsApp Canggih &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Harga Terjangkau
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed">
            Tingkatkan keamanan grup, kelola member tanpa ribet, dan dorong omzet penjualan dengan
            fitur otomatisasi terbaik dari VamxBotz.
          </p>

          {/* Key Advantages */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Aktif 24 Jam Non-Stop
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Aktivasi Kilat 1-3 Menit
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Bebas Perpanjang Kapan Saja
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Garansi Uptime Penuh
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            const waUrl = `https://wa.me/${botInfo.ownerNumber}?text=${encodeURIComponent(tier.ctaPrefill)}`;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 ${
                  tier.isPopular
                    ? "border-2 border-emerald-500/80 bg-zinc-900/90 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2"
                    : "border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 shadow-md flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-zinc-950" />
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        tier.isPopular
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-zinc-800/80 text-zinc-300 border border-zinc-700"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {!tier.isPopular && tier.badge && (
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 min-h-[36px]">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-zinc-400 font-medium">Rp</span>
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        <AnimatedCounter value={tier.priceMonthly} />
                      </span>
                      <span className="text-xs text-zinc-400">/ bulan</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                      {tier.periodLabel}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-semibold text-zinc-300 block mb-2 uppercase tracking-wider">
                      Fitur Termasuk:
                    </span>
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}

                    {tier.notIncluded?.map((nf, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 line-through">
                        <span className="h-4 w-4 flex items-center justify-center text-zinc-600 flex-shrink-0">
                          ✕
                        </span>
                        <span>{nf}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 ${
                    tier.isPopular
                      ? "bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-lg shadow-emerald-500/25"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </a>
              </div>
            );
          })}
        </div>

        {/* 3 Steps to Rent Section */}
        <section className="mb-20 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 sm:p-10 backdrop-blur-sm">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Proses Cepat & Mudah
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Cara Sewa Bot dalam 3 Langkah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm mb-4 border border-emerald-500/40">
                1
              </span>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Pilih Paket Sewa</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tentukan paket sesuai kebutuhan grup (Standar, Pro Bisnis, atau VIP Custom) lalu klik
                tombol chat WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-bold text-sm mb-4 border border-cyan-500/40">
                2
              </span>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Bayar via QRIS / E-Wallet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scan kode QRIS instan dari DANA, GoPay, OVO, ShopeePay, atau Bank Transfer. Kirim bukti
                struk ke owner.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-bold text-sm mb-4 border border-purple-500/40">
                3
              </span>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Bot Otomatis Masuk Grup</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kirim link undangan grup Anda. Bot akan langsung join dan aktif mengamankan grup Anda
                dalam hitungan menit!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <HelpCircle className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Jawaban seputar teknis sewa, perpanjangan, dan keamanan bot VamxBotz.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-zinc-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-emerald-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Direct Contact Banner */}
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Punya Kebutuhan Khusus / Bot Kustom?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Kami juga melayani pembuatan fitur kustom, bot transaksi otomatis, ataupun integrasi
              API khusus untuk usaha Anda. Hubungi kami untuk konsultasi gratis.
            </p>
          </div>
          <a
            href={`https://wa.me/${botInfo.ownerNumber}?text=Halo%20kak%20Vamz,%20saya%20ingin%20konsultasi%20custom%20bot`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Send className="h-4 w-4" />
            <span>Chat Langsung ke Owner</span>
          </a>
        </div>
      </main>

      <Footer />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}

export default SewaPage;
