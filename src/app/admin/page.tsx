"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { botInfo } from "@/data/bot-info";
import {
  Lock,
  Unlock,
  Shield,
  Activity,
  Users,
  Zap,
  MessageSquare,
  ShoppingBag,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Send,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  X,
  Radio,
} from "lucide-react";

interface StatusRecord {
  id?: string;
  bot_name: string;
  version: string;
  is_online: boolean;
  mode: string;
  total_users: number;
  total_groups: number;
  total_hits: number;
  last_ping?: string;
}

interface FeedbackRecord {
  id: string;
  name: string;
  phone_or_telegram: string | null;
  category: string;
  message: string;
  is_reviewed: boolean;
  created_at: string;
}

interface RentalRecord {
  id: string;
  client_name: string;
  phone_number: string;
  group_name: string;
  package_type: string;
  price: number;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "pending";
  notes: string | null;
}

const DEFAULT_PIN = "vamx2026";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"status" | "sewa" | "feedback" | "broadcast">("status");

  // Status State
  const [statusData, setStatusData] = useState<StatusRecord>({
    bot_name: botInfo.name,
    version: botInfo.version,
    is_online: true,
    mode: "Public",
    total_users: 1420,
    total_groups: 89,
    total_hits: 45210,
  });
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Rentals State
  const [rentals, setRentals] = useState<RentalRecord[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [isAddRentalOpen, setIsAddRentalOpen] = useState(false);
  const [newRental, setNewRental] = useState({
    client_name: "",
    phone_number: "",
    group_name: "",
    package_type: "Standar",
    price: 15000,
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  });

  // Feedbacks State
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Broadcast Generator State
  const [broadcastTitle, setBroadcastTitle] = useState("PEMBERITAHUAN UPDATE VAMXBOTZ");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Halo member grup! Kami telah menambahkan fitur baru dan peningkatan kecepatan server. Ketik .menu untuk mencoba."
  );
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  // Check auth session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("vamx_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    loadAllData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("vamx_admin_auth", "true");
      setPinError("");
    } else {
      setPinError("PIN salah! Default PIN: vamx2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("vamx_admin_auth");
    setPinInput("");
  };

  const loadAllData = async () => {
    const supabase = createClient();
    if (!supabase) return;

    // Load Bot Status
    try {
      const { data: statusRes } = await supabase
        .from("bot_status")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (statusRes) {
        setStatusData(statusRes as StatusRecord);
      }
    } catch (err) {
      console.error("Error loading status:", err);
    }

    // Load Rentals
    setRentalsLoading(true);
    try {
      const { data: rentalRes } = await supabase
        .from("bot_rentals")
        .select("*")
        .order("created_at", { ascending: false });

      if (rentalRes) {
        setRentals(rentalRes as RentalRecord[]);
      }
    } catch (err) {
      console.error("Error loading rentals:", err);
    } finally {
      setRentalsLoading(false);
    }

    // Load Feedbacks
    setFeedbackLoading(true);
    try {
      const { data: feedRes } = await supabase
        .from("bot_feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (feedRes) {
        setFeedbacks(feedRes as FeedbackRecord[]);
      }
    } catch (err) {
      console.error("Error loading feedbacks:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Save Bot Status to Supabase
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusSaving(true);
    setStatusMessage(null);

    try {
      const supabase = createClient();
      if (!supabase) {
        setStatusMessage({ type: "error", text: "Supabase client tidak terkonfigurasi." });
        setStatusSaving(false);
        return;
      }

      const payload = {
        bot_name: statusData.bot_name,
        version: statusData.version,
        is_online: statusData.is_online,
        mode: statusData.mode,
        total_users: Number(statusData.total_users),
        total_groups: Number(statusData.total_groups),
        total_hits: Number(statusData.total_hits),
        updated_at: new Date().toISOString(),
      };

      if (statusData.id) {
        const { error } = await supabase.from("bot_status").update(payload).eq("id", statusData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("bot_status").insert([payload]);
        if (error) throw error;
      }

      setStatusMessage({ type: "success", text: "Status bot berhasil diperbarui ke Supabase DB!" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menyimpan status.";
      setStatusMessage({ type: "error", text: errorMessage });
    } finally {
      setStatusSaving(false);
    }
  };

  // Add Rental
  const handleAddRental = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("bot_rentals")
        .insert([
          {
            client_name: newRental.client_name,
            phone_number: newRental.phone_number.replace(/\D/g, ""),
            group_name: newRental.group_name,
            package_type: newRental.package_type,
            price: Number(newRental.price),
            end_date: newRental.end_date,
            status: "active",
            notes: newRental.notes,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setRentals([data as RentalRecord, ...rentals]);
        setIsAddRentalOpen(false);
        setNewRental({
          client_name: "",
          phone_number: "",
          group_name: "",
          package_type: "Standar",
          price: 15000,
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          notes: "",
        });
      }
    } catch (err: unknown) {
      alert("Gagal menambahkan data sewa: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Toggle Feedback Review
  const handleToggleReview = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    if (!supabase) return;

    try {
      await supabase.from("bot_feedback").update({ is_reviewed: !currentStatus }).eq("id", id);
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_reviewed: !currentStatus } : f))
      );
    } catch (err) {
      console.error("Gagal update status review:", err);
    }
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Hapus feedback ini?")) return;
    const supabase = createClient();
    if (!supabase) return;

    try {
      await supabase.from("bot_feedback").delete().eq("id", id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Gagal menghapus feedback:", err);
    }
  };

  // Generate WhatsApp Reminder Text
  const getRentalWaReminderUrl = (rental: RentalRecord) => {
    const cleanPhone = rental.phone_number.startsWith("0")
      ? "62" + rental.phone_number.slice(1)
      : rental.phone_number;

    const message = `Halo kak ${rental.client_name} (${rental.group_name})! 👋\n\nPemberitahuan masa sewa bot *${botInfo.name}* (Paket ${rental.package_type}) akan berakhir pada tanggal *${rental.end_date}*.\n\nUntuk perpanjangan masa aktif grup, silakan hubungi kami kembali. Terima kasih! 🙏`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Copy Broadcast Text
  const copyBroadcastFormatted = () => {
    const text = `📢 *[ ${broadcastTitle.toUpperCase()} ]* 📢\n\n${broadcastMessage}\n\n━━━━━━━━━━━━━━━━━━━━\n⚡ *${botInfo.name} v${statusData.version}*\n🌐 *Docs:* https://vamxbotz-docs.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Navbar />

      {/* If Not Authenticated: Show PIN Login Form */}
      {!isAuthenticated ? (
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto mb-6">
              <Lock className="h-7 w-7" />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Panel monitoring status bot, kelola jasa sewa, dan feedback pengunjung.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Masukkan PIN Keamanan Admin:
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ketik PIN (default: vamx2026)"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98"
              >
                <Unlock className="h-4 w-4" />
                <span>Masuk ke Panel Admin</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
              <span className="text-[11px] text-zinc-500">
                💡 Default Master PIN: <strong className="text-emerald-400 font-mono">vamx2026</strong>
              </span>
            </div>
          </div>
        </main>
      ) : (
        /* If Authenticated: Show Full Admin Dashboard */
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
          {/* Top Admin Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Admin Panel Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pusat Kontrol & Manajemen VamxBotz
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Terhubung langsung ke Supabase Database (`qowkaiuljwkusgwnslwg`).
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadAllData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Sync Data</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">Status Server Bot</span>
              <div className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    statusData.is_online ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span className="text-lg font-bold text-white">
                  {statusData.is_online ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                Mode: {statusData.mode}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">Penyewa Aktif</span>
              <span className="text-2xl font-bold text-emerald-400 block">
                {rentals.filter((r) => r.status === "active").length} Grup
              </span>
              <span className="text-[11px] text-zinc-500 mt-1 block">Total tercatat: {rentals.length}</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">Feedback Masuk</span>
              <span className="text-2xl font-bold text-cyan-400 block">{feedbacks.length} Pesan</span>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                {feedbacks.filter((f) => !f.is_reviewed).length} belum ditinjau
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xs text-zinc-400 block mb-1">Total Hits Bot</span>
              <span className="text-2xl font-bold text-indigo-400 block">
                {statusData.total_hits.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 mt-1 block">Eksekusi perintah</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-zinc-800 mb-8 overflow-x-auto scrollbar-none pb-2">
            <button
              onClick={() => setActiveTab("status")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "status"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Status & Kontrol Bot</span>
            </button>

            <button
              onClick={() => setActiveTab("sewa")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "sewa"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Jasa Sewa Bot ({rentals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "feedback"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Feedback & Saran ({feedbacks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("broadcast")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "broadcast"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Radio className="h-4 w-4" />
              <span>Generator Broadcast WA</span>
            </button>
          </div>

          {/* TAB 1: STATUS KONTROL BOT */}
          {activeTab === "status" && (
            <div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Konfigurasi Data Realtime Bot</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ubah data di bawah ini untuk mengupdate info live di halaman utama docs secara instan.
                  </p>
                </div>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>

              {statusMessage && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs flex items-center gap-2.5 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveStatus} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Online Toggle */}
                  <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Status Operasional Bot:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setStatusData({ ...statusData, is_online: true })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          statusData.is_online
                            ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                            : "bg-zinc-900 text-zinc-400"
                        }`}
                      >
                        🟢 Online Aktif
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusData({ ...statusData, is_online: false })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          !statusData.is_online
                            ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                            : "bg-zinc-900 text-zinc-400"
                        }`}
                      >
                        🔴 Maintenance
                      </button>
                    </div>
                  </div>

                  {/* Mode Bot */}
                  <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                    <label className="block text-xs font-medium text-zinc-300 mb-2">Mode Bot:</label>
                    <select
                      value={statusData.mode}
                      onChange={(e) => setStatusData({ ...statusData, mode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Public">Public (Semua Grup)</option>
                      <option value="Self">Self (Khusus Owner)</option>
                      <option value="Premium Only">Premium Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Users */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Total Pengguna (User):
                    </label>
                    <input
                      type="number"
                      value={statusData.total_users}
                      onChange={(e) =>
                        setStatusData({ ...statusData, total_users: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Total Groups */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Total Grup Terdaftar:
                    </label>
                    <input
                      type="number"
                      value={statusData.total_groups}
                      onChange={(e) =>
                        setStatusData({ ...statusData, total_groups: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Total Hits */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Total Hit Command:
                    </label>
                    <input
                      type="number"
                      value={statusData.total_hits}
                      onChange={(e) =>
                        setStatusData({ ...statusData, total_hits: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={statusSaving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{statusSaving ? "Menyimpan ke Supabase..." : "Simpan & Terapkan Perubahan"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MANAJEMEN JASA SEWA BOT */}
          {activeTab === "sewa" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Daftar Grup & Klien Sewa Bot</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Kelola masa aktif sewa grup, kirim pengingat perpanjangan via WhatsApp otomatis.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddRentalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all self-start sm:self-auto shadow-md shadow-emerald-500/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Klien Sewa Baru</span>
                </button>
              </div>

              {/* Add Rental Modal */}
              {isAddRentalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                      <h3 className="font-bold text-base text-white">Tambah Penyewa Bot Baru</h3>
                      <button
                        onClick={() => setIsAddRentalOpen(false)}
                        className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddRental} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Nama Pemesan / Client:
                        </label>
                        <input
                          type="text"
                          required
                          value={newRental.client_name}
                          onChange={(e) => setNewRental({ ...newRental, client_name: e.target.value })}
                          placeholder="Misal: Andi Olshop"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Nomor WhatsApp:
                          </label>
                          <input
                            type="text"
                            required
                            value={newRental.phone_number}
                            onChange={(e) =>
                              setNewRental({ ...newRental, phone_number: e.target.value })
                            }
                            placeholder="628123456789"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Nama Grup WA:
                          </label>
                          <input
                            type="text"
                            required
                            value={newRental.group_name}
                            onChange={(e) => setNewRental({ ...newRental, group_name: e.target.value })}
                            placeholder="Misal: Komunitas Gaming ID"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Pilihan Paket:
                          </label>
                          <select
                            value={newRental.package_type}
                            onChange={(e) =>
                              setNewRental({
                                ...newRental,
                                package_type: e.target.value,
                                price:
                                  e.target.value === "Standar"
                                    ? 15000
                                    : e.target.value === "Pro"
                                    ? 30000
                                    : 50000,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                          >
                            <option value="Standar">Standar (Rp 15.000)</option>
                            <option value="Pro">Pro Bisnis (Rp 30.000)</option>
                            <option value="VIP">VIP Custom (Rp 50.000)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Tanggal Berakhir:
                          </label>
                          <input
                            type="date"
                            required
                            value={newRental.end_date}
                            onChange={(e) => setNewRental({ ...newRental, end_date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Catatan / ID Grup:
                        </label>
                        <input
                          type="text"
                          value={newRental.notes}
                          onChange={(e) => setNewRental({ ...newRental, notes: e.target.value })}
                          placeholder="Misal: ID Grup 120363024@g.us"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddRentalOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs bg-zinc-900 text-zinc-400 hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
                        >
                          Simpan Penyewa
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Rental Table */}
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                {rentalsLoading ? (
                  <div className="p-8 text-center text-xs text-zinc-500">Memuat data sewa...</div>
                ) : rentals.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs">
                    Belum ada klien sewa yang tercatat. Klik tombol di atas untuk menambahkan.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                        <tr>
                          <th className="px-5 py-3.5">Nama Klien / Grup</th>
                          <th className="px-4 py-3.5">Nomor WA</th>
                          <th className="px-4 py-3.5">Paket</th>
                          <th className="px-4 py-3.5">Tarif</th>
                          <th className="px-4 py-3.5">Jatuh Tempo</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-sans">
                        {rentals.map((r) => {
                          const isExpired = new Date(r.end_date) < new Date();
                          return (
                            <tr key={r.id} className="hover:bg-zinc-850/50 transition-colors">
                              <td className="px-5 py-3.5">
                                <span className="font-semibold text-zinc-100 block">{r.client_name}</span>
                                <span className="text-[11px] text-zinc-500">{r.group_name}</span>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-300">
                                {r.phone_number}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-emerald-400">
                                  {r.package_type}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-zinc-200">
                                Rp {r.price.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5">
                                <span
                                  className={`text-[11px] font-mono ${
                                    isExpired ? "text-red-400 font-bold" : "text-zinc-300"
                                  }`}
                                >
                                  {r.end_date} {isExpired ? "(Expired)" : ""}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    isExpired
                                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  }`}
                                >
                                  {isExpired ? "Expired" : "Aktif"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <a
                                  href={getRentalWaReminderUrl(r)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                >
                                  <Send className="h-3 w-3" />
                                  <span>WA Reminder</span>
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FEEDBACK PENGUNJUNG */}
          {activeTab === "feedback" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Pesan & Request Fitur Pengunjung</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Data dikirim langsung oleh pengunjung melalui formulir website docs.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Total: {feedbacks.length} Pesan</span>
              </div>

              {feedbackLoading ? (
                <div className="p-8 text-center text-xs text-zinc-500">Memuat feedback...</div>
              ) : feedbacks.length === 0 ? (
                <div className="p-12 rounded-3xl border border-zinc-800 bg-zinc-900/30 text-center text-zinc-500 text-xs">
                  Belum ada feedback yang masuk dari pengunjung.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbacks.map((f) => (
                    <div
                      key={f.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        f.is_reviewed
                          ? "border-zinc-800/80 bg-zinc-900/30 opacity-70"
                          : "border-emerald-500/30 bg-zinc-900/70 shadow-lg shadow-emerald-500/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">{f.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                            {f.category}
                          </span>
                        </div>

                        <span className="text-[10px] text-zinc-500">
                          {new Date(f.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 mb-3 font-sans whitespace-pre-wrap">
                        {f.message}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Kontak: {f.phone_or_telegram || "-"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleReview(f.id, f.is_reviewed)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              f.is_reviewed
                                ? "bg-zinc-800 text-zinc-400"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {f.is_reviewed ? "Selesai" : "Tandai Ditinjau"}
                          </button>

                          <button
                            onClick={() => handleDeleteFeedback(f.id)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GENERATOR BROADCAST WA */}
          {activeTab === "broadcast" && (
            <div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white">Generator Teks Broadcast WhatsApp</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Buat pesan pengumuman atau info maintenance yang siap disalin ke bot atau grup WhatsApp.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Judul Pengumuman:
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Isi Pesan:</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                  />
                </div>
              </div>

              {/* Preview Bubble */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 mb-6 whitespace-pre-wrap">
                <div className="text-emerald-400 font-bold mb-2">
                  📢 *[ {broadcastTitle.toUpperCase()} ]* 📢
                </div>
                <p>{broadcastMessage}</p>
                <div className="mt-3 text-[10px] text-zinc-500 border-t border-zinc-800 pt-2">
                  ⚡ *{botInfo.name} v{statusData.version}*
                  <br />
                  🌐 *Docs:* https://vamxbotz-docs.vercel.app
                </div>
              </div>

              <button
                onClick={copyBroadcastFormatted}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-98"
              >
                {copiedBroadcast ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedBroadcast ? "Tersalin ke Clipboard!" : "Salin Format WhatsApp"}</span>
              </button>
            </div>
          )}
        </main>
      )}

      <Footer />
    </div>
  );
}

export default AdminPage;
