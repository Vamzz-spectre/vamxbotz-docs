"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Shield,
  Download,
  Zap,
  Play,
  Pause,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { botInfo } from "@/data/bot-info";
import { createClient } from "@/lib/supabase/client";

interface SlideItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  tag: string;
  type: "image-hero" | "chat-mockup";
  imageSrc?: string;
  chatData?: {
    userMsg: string;
    botName: string;
    botTime: string;
    botResponseHeader: string;
    botBodyLines: string[];
    footerNotice?: string;
    actionTag?: string;
  };
}

const defaultSlides: SlideItem[] = [
  {
    id: "hero-profile",
    badge: "Official Avatar & Profile",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    title: "VamxBotz WhatsApp Multi-Device",
    subtitle: "Asisten bot WhatsApp generasi terbaru dengan kecepatan kilat dan stabilitas 24/7.",
    tag: "v1.2.0 • Active",
    type: "image-hero",
    imageSrc: "/images/bot-avatar.jpg",
  },
  {
    id: "menu-dashboard",
    badge: "Interactive Command Menu",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    title: "Tampilan Menu Interaktif (.menu)",
    subtitle: "Navigasi perintah terstruktur rapi, cepat dieksekusi, dan ramah pengguna.",
    tag: "80+ Perintah Siap Pakai",
    type: "chat-mockup",
    chatData: {
      userMsg: ".menu",
      botName: "VamxBotz AI ⚡",
      botTime: "00:24",
      botResponseHeader: "╭━━━〔 ⚡ VAMXBOTZ DASHBOARD ⚡ 〕━━━╮",
      botBodyLines: [
        "👤 *Owner:* Vamz Spectre (@vamzahai)",
        "🌐 *Mode:* Public Multi-Device",
        "⏱️ *Uptime:* 18 hari, 7 jam",
        "📂 *Kategori Tersedia:*",
        "  • 🛡️ .groupmenu (Anti-link, Kick, Mute)",
        "  • 🚀 .jpmmenu (Broadcast & Push Kontak)",
        "  • 📥 .downloadmenu (TikTok, IG, YT, Spotify)",
        "  • 🤖 .aimenu (GPT-4o, Gemini AI, Vision)",
        "  • 🎨 .stickermenu (Sticker Maker & WM)",
        "  • 👑 .ownermenu (Control & Sewa)",
      ],
      footerNotice: "Ketik perintah dengan prefix titik (.) contoh: .tiktok [url]",
      actionTag: "Multi-Platform Supported",
    },
  },
  {
    id: "ai-assistant",
    badge: "Next-Gen AI Intelligence",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    title: "AI Assistant Pintar (.ai & .gemini)",
    subtitle: "Tanya jawab cerdas, coding, ringkasan materi, hingga voice AI langsung di WA.",
    tag: "GPT-4o & Gemini 1.5",
    type: "chat-mockup",
    chatData: {
      userMsg: ".ai buatkan script landing page modern pakai Next.js dan Tailwind",
      botName: "VamxBotz AI ⚡",
      botTime: "00:25",
      botResponseHeader: "🤖 *VAMX-AI CODER INTELLIGENCE*",
      botBodyLines: [
        "Tentu! Berikut arsitektur landing page modern:",
        "1. Gunakan Next.js App Router untuk performa SEO maksimal.",
        "2. Padukan Tailwind CSS v4 dengan backdrop blur & neon accent.",
        "3. Pasang Supabase Client untuk realtime data widget.",
        "4. Terapkan animasi counter dan responsive card slider.",
        "💡 *Kode lengkap berhasil digenerate!* Butuh modifikasi fitur lainnya?",
      ],
      footerNotice: "Powered by Gemini 1.5 Flash & GPT API",
      actionTag: "Ultra-Fast Response (<1s)",
    },
  },
  {
    id: "media-downloader",
    badge: "High-Speed Downloader",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    title: "Unduh Media Tanpa Watermark (.tiktok / .ig)",
    subtitle: "Download otomatis video TikTok HD, Instagram Reels, YouTube audio tanpa jeda.",
    tag: "Zero Watermark HD",
    type: "chat-mockup",
    chatData: {
      userMsg: ".ttdl https://vt.tiktok.com/ZSxyz123/",
      botName: "VamxBotz Downloader 📥",
      botTime: "00:26",
      botResponseHeader: "🎬 *TIKTOK DOWNLOADER SUKSES*",
      botBodyLines: [
        "📌 *Judul:* Tren Terbaru 2026 Viral Sound",
        "👤 *Author:* @content_creator_id",
        "🎵 *Audio:* Sound Original Full HD",
        "⚡ *Kualitas:* 1080p 60fps (No Watermark)",
        "Sedang mengirimkan file video langsung ke chat Anda...",
      ],
      footerNotice: "✅ File media 4.2 MB siap dinikmati!",
      actionTag: "Direct WhatsApp Video",
    },
  },
  {
    id: "push-broadcast",
    badge: "Marketing & Broadcast Pro",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    title: "Push Kontak & JPM Otomatis (.pushkontak)",
    subtitle: "Kirim pesan promosi massal aman dengan jeda otomatis anti-banned nomor WhatsApp.",
    tag: "Anti-Ban Safe Delay",
    type: "chat-mockup",
    chatData: {
      userMsg: ".pushkontak Halo kak, promo sewa bot murah aktif hari ini! | delay: 5s",
      botName: "VamxBotz JPM System 🚀",
      botTime: "00:27",
      botResponseHeader: "📢 *MEMULAI PUSH KONTAK MASSAL*",
      botBodyLines: [
        "🎯 *Target Grup:* Bisnis & Komunitas Online",
        "👥 *Jumlah Member:* 254 Kontak Terdeteksi",
        "⏱️ *Interval Delay:* 5 Detik / Kontak (Safe Mode)",
        "📊 *Progres Saat Ini:* [==================>] 100%",
        "✅ Berhasil terkirim ke semua nomor tanpa kendala!",
      ],
      footerNotice: "Keamanan akun terproteksi sistem smart delay",
      actionTag: "254 Kontak Terkirim",
    },
  },
  {
    id: "security-group",
    badge: "Advanced Group Defense",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    title: "Proteksi Grup 24 Jam (.antilink & .kick)",
    subtitle: "Grup bersih dari spammer, link phising, dan bot pengacau secara otomatis.",
    tag: "Auto-Kick & Mute",
    type: "chat-mockup",
    chatData: {
      userMsg: "https://chat.whatsapp.com/SpamGroupPromoteLink123",
      botName: "VamxBotz Security 🛡️",
      botTime: "00:28",
      botResponseHeader: "🚨 *PERINGATAN PELANGGARAN ATURAN GRUP*",
      botBodyLines: [
        "Terdeteksi link grup WhatsApp pihak ketiga!",
        "👤 *Pelanggar:* @628987654321",
        "⚠️ *Aksi:* Pesan otomatis dihapus!",
        "⛔ Member telah dikeluarkan dari grup (Auto-Kick aktif).",
        "Jaga keamanan grup bersama VamxBotz Guardian.",
      ],
      footerNotice: "Mode Anti-Link: ON • Admin Only Bypass",
      actionTag: "Threat Neutralized",
    },
  },
];

export function BotImageStack() {
  const [slides, setSlides] = useState<SlideItem[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fetch dynamic slides from Supabase if available
  useEffect(() => {
    async function fetchDynamicSlides() {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data, error } = await supabase
          .from("bot_slides")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (data && data.length > 0 && !error) {
          const mapped: SlideItem[] = data.map((d) => ({
            id: d.id,
            badge: d.badge,
            badgeColor: d.badge_color || "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            title: d.title,
            subtitle: d.subtitle,
            tag: d.tag,
            type: d.type as "image-hero" | "chat-mockup",
            imageSrc: d.image_src || (d.type === "image-hero" ? "/images/bot-avatar.jpg" : undefined),
            chatData: d.chat_data || undefined,
          }));
          setSlides(mapped);
        }
      } catch {
        // Fallback to defaultSlides
      }
    }
    fetchDynamicSlides();
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="mb-20 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Bot Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Preview Tampilan & Fitur Bot
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Simulasi visual interaktif antarmuka WhatsApp VamxBotz. Geser atau klik kartu untuk
            mengeksplorasi kemampuan bot.
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            title={isAutoPlay ? "Pause Auto Slide" : "Resume Auto Slide"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
          >
            {isAutoPlay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
            <span className="hidden xs:inline">{isAutoPlay ? "Auto-Play" : "Paused"}</span>
          </button>

          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stacked Deck Container */}
      <div
        className="relative w-full min-h-[460px] sm:min-h-[500px] md:min-h-[540px] flex items-center justify-center overflow-hidden py-6 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Glow backdrop behind cards */}
        <div className="absolute w-[80%] max-w-lg h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -top-10 left-1/2 -translate-x-1/2" />

        {slides.map((slide, index) => {
          // Calculate relative position to currentIndex: 0 = active, 1 = behind 1, 2 = behind 2, etc.
          const total = slides.length;
          const offset = (index - currentIndex + total) % total;

          // Only render visible cards in stack (active + next 3)
          if (offset > 3 && offset < total - 1) {
            return null;
          }

          const isCurrent = offset === 0;

          // Calculate transforms for 3D stacked deck effect
          let translateX = "0px";
          let translateY = "0px";
          let scale = 1;
          let rotate = 0;
          let opacity = 1;
          let zIndex = 30;

          if (offset === 0) {
            translateX = "0px";
            translateY = "0px";
            scale = 1;
            rotate = 0;
            opacity = 1;
            zIndex = 30;
          } else if (offset === 1) {
            translateX = "16px";
            translateY = "14px";
            scale = 0.95;
            rotate = 2.5;
            opacity = 0.85;
            zIndex = 20;
          } else if (offset === 2) {
            translateX = "32px";
            translateY = "28px";
            scale = 0.9;
            rotate = 5;
            opacity = 0.6;
            zIndex = 10;
          } else if (offset === 3) {
            translateX = "48px";
            translateY = "42px";
            scale = 0.85;
            rotate = 7.5;
            opacity = 0.35;
            zIndex = 5;
          } else {
            // Card sliding away to left
            translateX = "-40px";
            translateY = "-10px";
            scale = 0.92;
            rotate = -4;
            opacity = 0;
            zIndex = 0;
          }

          return (
            <div
              key={slide.id}
              onClick={() => {
                if (!isCurrent) setCurrentIndex(index);
              }}
              style={{
                transform: `translate3d(${translateX}, ${translateY}, 0px) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                zIndex,
                transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease",
              }}
              className={`absolute top-4 w-[92%] sm:w-[540px] md:w-[620px] max-w-full rounded-2xl border cursor-pointer shadow-2xl transition-shadow ${
                isCurrent
                  ? "border-emerald-500/40 bg-zinc-900/95 shadow-emerald-500/10 cursor-default"
                  : "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 shadow-black/80"
              } backdrop-blur-xl overflow-hidden`}
            >
              {/* Card Header Bar (Simulating WhatsApp header) */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/60">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                    <Bot className="h-5 w-5" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                      {slide.chatData?.botName || botInfo.name}
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 inline" />
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {slide.chatData ? "Online • WhatsApp Bot" : "Official Avatar Profile"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded-full border ${slide.badgeColor}`}
                  >
                    {slide.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6">
                {slide.type === "image-hero" && slide.imageSrc ? (
                  <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg flex-shrink-0 group">
                      <Image
                        src={slide.imageSrc}
                        alt="VamxBotz Banner"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-mono text-emerald-300 bg-zinc-950/80 px-1 py-0.5 rounded border border-emerald-500/30">
                        ORIGINAL AVATAR
                      </span>
                    </div>

                    <div className="flex flex-col justify-center text-center sm:text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                        {slide.badge}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{slide.title}</h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                        {slide.subtitle}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-left">
                        <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px]">
                          <span className="text-zinc-500 block">Developer</span>
                          <strong className="text-emerald-400">{botInfo.creator}</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px]">
                          <span className="text-zinc-500 block">WhatsApp Support</span>
                          <strong className="text-zinc-200">Multi-Device Baileys</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 font-sans">
                    {/* User Message Bubble */}
                    {slide.chatData?.userMsg && (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-600/90 text-zinc-50 px-3.5 py-2 text-xs sm:text-sm shadow-md">
                          <p className="font-mono text-zinc-100">{slide.chatData.userMsg}</p>
                          <span className="block text-[10px] text-emerald-200/80 text-right mt-0.5">
                            {slide.chatData.botTime} ✓✓
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bot Response Bubble */}
                    {slide.chatData && (
                      <div className="flex justify-start">
                        <div className="max-w-[95%] sm:max-w-[90%] rounded-2xl rounded-tl-xs bg-zinc-950 border border-zinc-800/80 p-3.5 sm:p-4 text-xs sm:text-sm shadow-lg text-zinc-200">
                          <div className="text-emerald-400 font-bold mb-2 pb-1.5 border-b border-zinc-800/60 text-xs sm:text-sm">
                            {slide.chatData.botResponseHeader}
                          </div>

                          <div className="space-y-1 font-mono text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                            {slide.chatData.botBodyLines.map((line, idx) => (
                              <p key={idx} className="whitespace-pre-wrap">
                                {line}
                              </p>
                            ))}
                          </div>

                          {slide.chatData.footerNotice && (
                            <div className="mt-3 pt-2 border-t border-zinc-800/50 text-[10px] text-zinc-400 flex items-center justify-between">
                              <span>{slide.chatData.footerNotice}</span>
                              <span className="text-[10px] text-zinc-500">{slide.chatData.botTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Bar */}
              <div className="px-4 sm:px-6 py-2.5 bg-zinc-950/80 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                <span className="text-[11px] flex items-center gap-1.5 text-zinc-400">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  {slide.title}
                </span>

                <span className="text-[10px] text-zinc-500 font-mono">
                  Slide {index + 1} dari {slides.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Pill Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-8 bg-emerald-400 shadow-sm shadow-emerald-400/50"
                : "w-2 bg-zinc-800 hover:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
