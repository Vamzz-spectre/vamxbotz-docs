import React from "react";
import { botInfo } from "@/data/bot-info";
import { Terminal, KeyRound, Sparkles, MessageSquareCode, CheckCircle2 } from "lucide-react";

export function QuickStart() {
  return (
    <section id="quickstart" className="mb-16 scroll-mt-20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Panduan Mulai Cepat</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-sm">
              1
            </div>
            <h3 className="font-semibold text-zinc-200">Gunakan Prefix</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            Ketik tanda titik <code className="text-emerald-400 bg-zinc-950 px-1.5 py-0.5 rounded font-mono">.</code> sebelum setiap perintah.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800/80 p-2.5 font-mono text-xs text-zinc-300">
            <span className="text-zinc-500">Contoh:</span> <span className="text-emerald-400">.menu</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-sm">
              2
            </div>
            <h3 className="font-semibold text-zinc-200">Tambahkan ke Grup</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            Jadikan bot sebagai Admin grup agar fitur proteksi (antilink, kick, welcome) dapat aktif sempurna.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Admin Group Enabled</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-sm">
              3
            </div>
            <h3 className="font-semibold text-zinc-200">Hubungi Owner</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            Untuk sewa bot grup, push kontak VIP, atau request script, chat langsung ke nomor owner resmi.
          </p>
          <a
            href={`https://wa.me/${botInfo.ownerNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-xs text-emerald-400 transition-colors"
          >
            <span className="font-mono">+{botInfo.ownerNumber}</span>
            <span className="font-medium">Chat WA &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
