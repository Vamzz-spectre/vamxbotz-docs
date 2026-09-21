"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { QuickStart } from "@/components/QuickStart";
import { BotStatusWidget } from "@/components/BotStatusWidget";
import { CommandCard } from "@/components/CommandCard";
import { SupabaseGuide } from "@/components/SupabaseGuide";
import { FeedbackModal } from "@/components/FeedbackModal";
import { Footer } from "@/components/Footer";
import { botInfo } from "@/data/bot-info";
import { commandsData, CommandCategory } from "@/data/commands";
import {
  Search,
  Terminal,
  Shield,
  Send,
  Zap,
  Download,
  FileCode,
  Sparkles,
  BookOpen,
  Filter,
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory>("All");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const categories: { label: CommandCategory; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: "All", icon: BookOpen },
    { label: "Group", icon: Shield },
    { label: "Broadcast Group", icon: Send },
    { label: "Push Kontak", icon: Zap },
    { label: "Downloader", icon: Download },
    { label: "Converter", icon: FileCode },
    { label: "Sticker", icon: Sparkles },
    { label: "Pengingat Kelas", icon: BookOpen },
    { label: "Random & AI", icon: Sparkles },
    { label: "Control / Owner", icon: Terminal },
  ];

  const filteredCommands = useMemo(() => {
    return commandsData.filter((cmd) => {
      const matchesCategory = selectedCategory === "All" || cmd.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cmd.name.toLowerCase().includes(query) ||
        cmd.syntax.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 font-sans">
      <Navbar onOpenFeedback={() => setIsFeedbackOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-900 bg-radial-[at_50%_0%] from-emerald-950/30 via-zinc-950 to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Official Documentation &mdash; {botInfo.name} v{botInfo.version}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Panduan & Dokumentasi Lengkap{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              {botInfo.name}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed">
            {botInfo.description} Jelajahi daftar perintah, petunjuk konfigurasi, panduan sewa bot, serta integrasi
            database Supabase.
          </p>

          {/* Quick Search Bar */}
          <div className="mx-auto max-w-2xl relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari perintah (misal: .hidetag, .ttdl, .pushkontak, .antilink)..."
                className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-700/70 pl-12 pr-4 py-4 text-sm sm:text-base text-zinc-100 placeholder-zinc-500 shadow-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-2 text-left px-2">
              💡 Tip: Anda bisa mencari berdasarkan nama command, fungsi, atau kategori.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* QuickStart Guide */}
        <QuickStart />

        {/* Live Bot & Server Status */}
        <BotStatusWidget />

        {/* Commands Explorer Section */}
        <section id="commands" className="mb-16 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-400" />
                Katalog Perintah ({filteredCommands.length})
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Pilih kategori di bawah untuk memfilter atau gunakan kotak pencarian di atas.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit">
              <Filter className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                Kategori: <strong className="text-zinc-200">{selectedCategory}</strong>
              </span>
            </div>
          </div>

          {/* Category Badges / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/80"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-zinc-950" : "text-emerald-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Commands Grid */}
          {filteredCommands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommands.map((command) => (
                <CommandCard key={command.name} command={command} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
              <Terminal className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
              <p className="text-zinc-300 font-medium">Tidak ada perintah yang cocok.</p>
              <p className="text-xs text-zinc-500 mt-1">
                Coba gunakan kata kunci pencarian yang lain atau ganti filter kategori.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-xs font-semibold text-emerald-400 hover:underline"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          )}
        </section>

        {/* Supabase Guide Section */}
        <SupabaseGuide />
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <Footer />
    </div>
  );
}
