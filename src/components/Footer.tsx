import React from "react";
import Link from "next/link";
import { botInfo } from "@/data/bot-info";
import {
  Terminal,
  Send,
  MessageCircle,
  Heart,
  Shield,
  Zap,
  Sparkles,
  Lock,
  ExternalLink,
  Clock,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/95 text-zinc-400 pt-16 pb-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold text-white tracking-tight">
                  {botInfo.name} Docs
                </p>
                <p className="text-xs text-zinc-500">
                  By {botInfo.creator}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Solusi bot WhatsApp cerdas, multi-device, tangguh, dan serbaguna untuk kebutuhan
              manajemen grup, download media otomatis, broadcast promosi JPM, serta asisten AI modern.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem Aktif & Terintegrasi Supabase</span>
            </div>
          </div>

          {/* Column 2: Navigasi Cepat */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Beranda Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  Fitur Unggulan Bot
                </Link>
              </li>
              <li>
                <Link href="/sewa" className="hover:text-emerald-400 transition-colors text-emerald-300 font-medium">
                  💰 Jasa Sewa Bot WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/#commands" className="hover:text-emerald-400 transition-colors">
                  Katalog Perintah Lengkap (80+)
                </Link>
              </li>
              <li>
                <a href="/api/status" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ExternalLink className="h-3 w-3 text-zinc-500" />
                  REST API Status Bot
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Fitur & Modul Bot */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              Modul Perintah Bot
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>🛡️ Anti-Link & Proteksi Grup 24 Jam</li>
              <li>📥 Downloader TikTok, IG, YT & Spotify</li>
              <li>🚀 Push Kontak & JPM Broadcast Aman</li>
              <li>🤖 Asisten AI Pintar GPT-4o & Gemini</li>
              <li>🎨 Pembuat Stiker & Converter Audio</li>
              <li>📅 Pengingat Kelas & Utilitas Sekolah</li>
            </ul>
          </div>

          {/* Column 4: Dukungan & Hubungi Owner */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4 flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
              Kontak & Komunitas
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href={`https://wa.me/${botInfo.ownerNumber}?text=Halo%20kak%20Vamz,%20saya%20ingin%20tanya%20seputar%20VamxBotz`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 text-zinc-200 transition-all group"
              >
                <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-medium">WhatsApp Owner</span>
                  <span className="text-[10px] text-zinc-400">+{botInfo.ownerNumber}</span>
                </div>
              </a>

              <a
                href={botInfo.waChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 text-zinc-200 transition-all"
              >
                <div className="h-7 w-7 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-medium">Saluran WhatsApp</span>
                  <span className="text-[10px] text-zinc-400">Info & Update Terbaru</span>
                </div>
                <ExternalLink className="h-3 w-3 text-zinc-500 ml-auto" />
              </a>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>Layanan Aktif: 24 Jam Setiap Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 {botInfo.name} Docs by {botInfo.creator}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline" /> untuk ekosistem
            WhatsApp Bot Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
