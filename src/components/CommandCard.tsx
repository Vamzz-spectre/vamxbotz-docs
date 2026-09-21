"use client";

import React, { useState } from "react";
import { CommandItem } from "@/data/commands";
import { Copy, Check, ShieldCheck, Crown, User, ArrowRight } from "lucide-react";

interface CommandCardProps {
  command: CommandItem;
}

export function CommandCard({ command }: CommandCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.syntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadge = (permission: CommandItem["permission"]) => {
    switch (permission) {
      case "Owner":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <Crown className="w-3 h-3" />
            Owner
          </span>
        );
      case "Admin":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3 h-3" />
            Admin Grup
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <User className="w-3 h-3" />
            Public
          </span>
        );
    }
  };

  return (
    <div className="group relative rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-emerald-500/40 hover:bg-zinc-900/90 hover:shadow-lg hover:shadow-emerald-950/20">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
            .{command.name}
          </span>
          {getBadge(command.permission)}
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            {command.category}
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Salin sintaks perintah"
          className="rounded-md p-1.5 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <p className="text-sm text-zinc-300 leading-relaxed mb-3">
        {command.description}
      </p>

      {/* Syntax Box */}
      <div className="rounded-lg bg-zinc-950/90 border border-zinc-800 px-3 py-2 font-mono text-xs text-zinc-300 flex items-center justify-between overflow-x-auto">
        <code className="text-emerald-400">{command.syntax}</code>
      </div>

      {/* Example Box if exists */}
      {command.example && (
        <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
          <ArrowRight className="h-3 w-3 text-zinc-500 shrink-0" />
          <span className="text-zinc-500">Contoh:</span>
          <span className="text-zinc-300">{command.example}</span>
        </div>
      )}
    </div>
  );
}
