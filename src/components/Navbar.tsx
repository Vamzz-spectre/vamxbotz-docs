"useclient";

import React from "react";
import Link from "next/link";
import { botInfo } from "@/data/bot-info";
import { Terminal, Send, MessageSquare, Database, ExternalLink } from "lucide-react";

interface NavbarProps {
  onOpenFeedback?: () => void;
}

export function Navbar({ onOpenFeedback }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-all">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-100 tracking-tight flex items-center gap-1.5 text-base">
                {botInfo.name}
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  Docs v{botInfo.version}
                </span>
              </span>
              <span className="text-[11px] text-zinc-400">by {botInfo.creator}</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <a href="#quickstart" className="hover:text-emerald-400 transition-colors">
            Mulai Cepat
          </a>
          <a href="#commands" className="hover:text-emerald-400 transition-colors">
            Katalog Perintah
          </a>
          <a href="#database" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            Supabase DB
          </a>
          <a href="#status" className="hover:text-emerald-400 transition-colors">
            Live Status
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700/80 rounded-lg hover:border-emerald-500/50 hover:bg-zinc-800 transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Request Fitur</span>
            </button>
          )}

          <a
            href={botInfo.waChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-500/20 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Saluran WA</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
}
