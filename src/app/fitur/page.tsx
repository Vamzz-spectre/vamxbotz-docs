"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeedbackModal } from "@/components/FeedbackModal";
import { CommandCard } from "@/components/CommandCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { botInfo } from "@/data/bot-info";
import { commandsData, CommandCategory } from "@/data/commands";
import {
  Shield,
  Zap,
  Download,
  Bot,
  Sparkles,
  BookOpen,
  Terminal,
  ShoppingBag,
  ExternalLink,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const categories: { label: CommandCategory; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "All", icon: BookOpen },
  { label: "Group", icon: Shield },
  { label: "Downloader", icon: Download },
  { label: "Broadcast Group", icon: SendIcon },
  { label: "Push Kontak", icon: Zap },
  { label: "Random & AI", icon: Bot },
  { label: "Converter", icon: Sparkles },
  { label: "Sticker", icon: Sparkles },
  { label: "Pengingat Kelas", icon: BookOpen },
  { label: "Control / Owner", icon: Terminal },
];

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function FiturContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory>("All");
  const [permissionFilter, setPermissionFilter] = useState<"All" | "Public" | "Admin" | "Owner">("All");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Filter commands
  const filteredCommands = useMemo(() => {
    return commandsData.filter((cmd) => {
      const matchesCategory = selectedCategory === "All" || cmd.category === selectedCategory;
      const matchesPermission = permissionFilter === "All" || cmd.permission === permissionFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cmd.name.toLowerCase().includes(query) ||
        cmd.syntax.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query);

      return matchesCategory && matchesPermission && matchesSearch;
    });
  }, [searchQuery, selectedCategory, permissionFilter]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Navbar onOpenFeedback={() => setIsFeedbackOpen(true)} />

      {/* Header */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 border-b border-zinc-900 bg-radial-[at_50%_0%] from-emerald-950/40 via-zinc-950 to-zinc-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            Katalog Fitur & Perintah Lengkap
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Eksplorasi Seluruh Modul &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Perintah VamxBotz
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-zinc-400 mb-8 leading-relaxed">
            Temukan lebih dari 80+ fungsi WhatsApp yang siap digunakan untuk perlindungan grup,
            download konten, broadcast marketing, asisten belajar, dan converter multimedia.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl font-bold text-white block">
                <AnimatedCounter value={commandsData.length} suffix="+" />
              </span>
              <span className="text-[11px] text-zinc-400">Perintah Siap Pakai</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl font-bold text-emerald-400 block">
                <AnimatedCounter value={9} suffix=" Modul" />
              </span>
              <span className="text-[11px] text-zinc-400">Kategori Modul</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl font-bold text-cyan-400 block">&lt; 0.8s</span>
              <span className="text-[11px] text-zinc-400">Kecepatan Respon</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-2xl font-bold text-indigo-400 block">24/7</span>
              <span className="text-[11px] text-zinc-400">Cloud Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Command Catalog Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Search & Filter Toolbar */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari perintah (misal: hidetag, tiktok, pushkontak, gemini, sticker)..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700/80 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Permission Filter */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-zinc-400 font-medium">Hak Akses:</span>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {(["All", "Public", "Admin", "Owner"] as const).map((perm) => (
                  <button
                    key={perm}
                    onClick={() => setPermissionFilter(perm)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      permissionFilter === perm
                        ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {perm === "All" ? "Semua" : perm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                      : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-zinc-950" : "text-emerald-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Filter className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              Menampilkan <strong className="text-white">{filteredCommands.length}</strong> dari{" "}
              {commandsData.length} perintah
            </span>
          </div>

          {searchQuery && (
            <span className="text-xs text-zinc-400">
              Hasil pencarian: <strong className="text-emerald-400">&quot;{searchQuery}&quot;</strong>
            </span>
          )}
        </div>

        {/* Commands Grid */}
        {filteredCommands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {filteredCommands.map((command) => (
              <CommandCard key={command.name} command={command} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center mb-16">
            <Terminal className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-200">Tidak ada perintah yang sesuai</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Kata kunci pencarian atau filter hak akses yang dipilih tidak menemukan hasil.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setPermissionFilter("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

        {/* Sewa Bot Bottom Banner */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ingin Menikmati Seluruh Fitur Ini di Grup Anda?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Daftarkan grup WhatsApp Anda sekarang dengan paket sewa murah mulai Rp 15.000 / bulan.
              Aktivasi instan dan bergaransi penuh.
            </p>
          </div>

          <Link
            href="/sewa"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Lihat Tarif Sewa Bot</span>
          </Link>
        </div>
      </main>

      <Footer />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}

export function FiturPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-xs">
          Memuat halaman fitur...
        </div>
      }
    >
      <FiturContent />
    </Suspense>
  );
}

export default FiturPage;
