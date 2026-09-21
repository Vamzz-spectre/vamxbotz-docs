"use client";

import React, { useState } from "react";
import { Database, Copy, Check, Terminal, ExternalLink, ShieldCheck } from "lucide-react";

export function SupabaseGuide() {
  const [copied, setCopied] = useState(false);

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="database" className="mb-16 scroll-mt-20">
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              Koneksi Supabase Database
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Ready for Vercel
              </span>
            </h2>
            <p className="text-sm text-zinc-400">
              Dokumentasi ini telah dilengkapi integrasi Supabase untuk tracking statistik bot, feedback, dan command logs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Step A */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-300">
                1
              </span>
              Buat Project & Jalankan Migrasi
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buka dashboard Supabase Anda, masuk ke menu <strong>SQL Editor</strong>, lalu jalankan file SQL schema yang sudah kami sediakan di folder:
            </p>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 font-mono text-xs text-emerald-400">
              supabase/schema.sql
            </div>
            <p className="text-xs text-zinc-400">
              Tabel <code className="text-zinc-300">bot_status</code>, <code className="text-zinc-300">bot_feedback</code>, dan <code className="text-zinc-300">command_logs</code> akan otomatis terbuat beserta RLS (Row Level Security).
            </p>
          </div>

          {/* Step B */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-300">
                  2
                </span>
                Atur Environment Variables
              </h3>
              <button
                onClick={copyEnv}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-800 px-2 py-1 rounded transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Tersalin" : "Copy"}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Masukkan ke file <code className="text-zinc-300">.env.local</code> (untuk lokal) atau di pengaturan <strong>Vercel &rarr; Settings &rarr; Environment Variables</strong>:
            </p>
            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs text-zinc-300 overflow-x-auto">
              <div className="text-emerald-400">NEXT_PUBLIC_SUPABASE_URL=...</div>
              <div className="text-emerald-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
