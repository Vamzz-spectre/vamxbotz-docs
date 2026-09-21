"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("Fitur Baru");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setStatus("submitting");

    try {
      const supabase = createClient();

      if (supabase) {
        const { error } = await supabase.from("bot_feedback").insert([
          {
            name,
            phone_or_telegram: contact,
            category,
            message,
          },
        ]);

        if (error) throw error;
      }

      setStatus("success");
      setTimeout(() => {
        setName("");
        setContact("");
        setMessage("");
        setStatus("idle");
        onClose();
      }, 1800);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-100">Kirim Feedback / Request Fitur</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h4 className="text-lg font-semibold text-zinc-100">Terima Kasih!</h4>
            <p className="text-sm text-zinc-400">Pesan / request fitur Anda telah berhasil dikirim ke database bot.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Nama / Nickname</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Alex"
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Nomor WhatsApp / Telegram (Opsional)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contoh: 08123456789 atau @username"
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Fitur Baru">💡 Request Fitur Baru</option>
                <option value="Bug">🐛 Laporan Bug</option>
                <option value="Sewa Bot">🤖 Sewa Bot Grup / Push Kontak</option>
                <option value="Pertanyaan">❓ Pertanyaan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Pesan / Detail Request</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ide fitur atau masalah yang dialami..."
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Gagal mengirim. Pastikan konfigurasi Supabase sudah aktif atau hubungi owner langsung.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{status === "submitting" ? "Mengirim..." : "Kirim Masukan"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
