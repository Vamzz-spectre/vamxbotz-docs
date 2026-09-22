"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { botInfo } from "@/data/bot-info";
import {
  Terminal,
  Send,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Shield,
  Menu,
  X,
  Lock,
  ExternalLink,
} from "lucide-react";

interface NavbarProps {
  onOpenFeedback?: () => void;
}

export function Navbar({ onOpenFeedback }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda", icon: Terminal },
    { href: "/fitur", label: "Fitur Bot", icon: Sparkles },
    { href: "/sewa", label: "Jasa Sewa", icon: ShoppingBag, highlight: true },
    { href: "/#commands", label: "Katalog Command", icon: Shield },
    { href: "/admin", label: "Admin", icon: Lock },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400 transition-all shadow-sm shadow-emerald-500/10">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-zinc-100 tracking-tight flex items-center gap-1.5 text-base">
                  {botInfo.name}
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    v{botInfo.version}
                  </span>
                </span>
                <span className="text-[11px] text-zinc-400">by {botInfo.creator}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent"
                  } ${link.highlight && !isActive ? "text-emerald-300 hover:text-emerald-200" : ""}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                  {link.label}
                  {link.highlight && (
                    <span className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Promo
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenFeedback && (
              <button
                onClick={onOpenFeedback}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/90 border border-zinc-700/80 rounded-lg hover:border-emerald-500/50 hover:bg-zinc-800 transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span>Request</span>
              </button>
            )}

            <Link
              href="/sewa"
              className="hidden xs:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Sewa Bot</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{botInfo.name} Docs</h4>
                  <p className="text-[11px] text-zinc-400">Navigasi Seluler Lengkap</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 mb-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-semibold"
                        : "bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 border border-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.highlight && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold">
                        Promo
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-2.5 pt-2 border-t border-zinc-900">
              <Link
                href="/sewa"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Pesan & Sewa Bot Sekarang</span>
              </Link>

              {onOpenFeedback && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenFeedback();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Kirim Saran / Laporan Bug</span>
                </button>
              )}

              <a
                href={botInfo.waChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 text-xs text-zinc-400 hover:text-white"
              >
                <Send className="h-3.5 w-3.5 text-emerald-400" />
                <span>Gabung Saluran WhatsApp Resmi</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
