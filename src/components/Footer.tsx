import React from "react";
import { botInfo } from "@/data/bot-info";
import { Terminal, Send, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {botInfo.name} Docs
            </p>
            <p className="text-xs text-zinc-500">
              WhatsApp Bot Ecosystem & Documentation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={botInfo.waChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <Send className="h-3.5 w-3.5" />
            Saluran WhatsApp
          </a>
          <a
            href={botInfo.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Telegram
          </a>
          <a
            href={`https://wa.me/${botInfo.ownerNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            Owner (+{botInfo.ownerNumber})
          </a>
        </div>

        <p className="text-xs text-zinc-600 flex items-center gap-1">
          Designed with <Heart className="h-3 w-3 text-red-500 inline fill-red-500" /> for {botInfo.creator}
        </p>
      </div>
    </footer>
  );
}
