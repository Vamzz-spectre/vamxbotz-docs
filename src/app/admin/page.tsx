"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Radio,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Terminal,
  Database,
  ArrowLeft,
  Search,
  Menu,
  X,
  Clock,
  Sparkles,
  Server,
  Layers,
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

interface SlideRecord {
  id: string;
  badge: string;
  badge_color?: string;
  title: string;
  subtitle: string;
  tag: string;
  type: "image-hero" | "chat-mockup";
  image_src?: string | null;
  sort_order: number;
  is_active: boolean;
}

const VALID_EMAILS = [
  "admin@vamxbotz.com",
  "vamzspectre@gmail.com",
  "admin@vamz.com",
  "owner@vamxbotz.com",
];
const MASTER_PASSWORD = "vamxadmin2026";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Navigation state (Sidebar)
  const [activeTab, setActiveTab] = useState<"overview" | "slides" | "sewa" | "feedback" | "broadcast" | "system">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Slides State (Manage showcase preview slides from admin!)
  const [slides, setSlides] = useState<SlideRecord[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({
    badge: "Fitur Unggulan",
    badge_color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    title: "",
    subtitle: "",
    tag: "Terbaru",
    type: "image-hero" as "image-hero" | "chat-mockup",
    image_src: "/images/bot-avatar.jpg",
    sort_order: 1,
    is_active: true,
  });

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
  const [rentalSearch, setRentalSearch] = useState("");
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
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState("All");

  // Broadcast Generator State
  const [broadcastTitle, setBroadcastTitle] = useState("PEMBERITAHUAN UPDATE FITUR VAMXBOTZ");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Halo member grup! Kami telah menambahkan sistem downloader multi-platform terbaru & kestabilan koneksi 24/7. Ketik .menu untuk melihat daftar perintah."
  );
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  // Check auth session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("vamx_admin_auth");
    const savedEmail = sessionStorage.getItem("vamx_admin_email");
    if (savedAuth === "true" && savedEmail) {
      setIsAuthenticated(true);
      setAdminEmail(savedEmail);
    }
  }, []);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    loadAllData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    const isEmailValid =
      VALID_EMAILS.includes(cleanEmail) ||
      cleanEmail.endsWith("@vamxbotz.com") ||
      cleanEmail.includes("admin");

    if (isEmailValid && cleanPass === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      setAdminEmail(cleanEmail);
      sessionStorage.setItem("vamx_admin_auth", "true");
      sessionStorage.setItem("vamx_admin_email", cleanEmail);
      setAuthError("");
    } else {
      setAuthError("Email atau Password salah! Periksa kembali kredensial Anda.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("vamx_admin_auth");
    sessionStorage.removeItem("vamx_admin_email");
    setEmailInput("");
    setPasswordInput("");
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

    // Load Slides
    setSlidesLoading(true);
    try {
      const { data: slidesRes } = await supabase
        .from("bot_slides")
        .select("*")
        .order("sort_order", { ascending: true });

      if (slidesRes) {
        setSlides(slidesRes as SlideRecord[]);
      }
    } catch (err) {
      console.error("Error loading slides:", err);
    } finally {
      setSlidesLoading(false);
    }
  };

  // Add Slide
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("bot_slides")
        .insert([
          {
            badge: newSlide.badge,
            badge_color: newSlide.badge_color,
            title: newSlide.title,
            subtitle: newSlide.subtitle,
            tag: newSlide.tag,
            type: newSlide.type,
            image_src: newSlide.image_src,
            sort_order: Number(newSlide.sort_order),
            is_active: newSlide.is_active,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setSlides([...slides, data as SlideRecord]);
        setIsAddSlideOpen(false);
        setNewSlide({
          badge: "Fitur Unggulan",
          badge_color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          title: "",
          subtitle: "",
          tag: "Terbaru",
          type: "image-hero",
          image_src: "/images/bot-avatar.jpg",
          sort_order: slides.length + 2,
          is_active: true,
        });
      }
    } catch (err: unknown) {
      alert("Gagal menambahkan slide: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Toggle Slide Active
  const handleToggleSlideActive = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    if (!supabase) return;

    try {
      await supabase.from("bot_slides").update({ is_active: !currentStatus }).eq("id", id);
      setSlides((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
      );
    } catch (err) {
      console.error("Gagal update status slide:", err);
    }
  };

  // Delete Slide
  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Hapus slide preview ini dari database?")) return;
    const supabase = createClient();
    if (!supabase) return;

    try {
      await supabase.from("bot_slides").delete().eq("id", id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Gagal menghapus slide:", err);
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

  // Filter rentals
  const filteredRentals = rentals.filter(
    (r) =>
      r.client_name.toLowerCase().includes(rentalSearch.toLowerCase()) ||
      r.group_name.toLowerCase().includes(rentalSearch.toLowerCase()) ||
      r.phone_number.includes(rentalSearch)
  );

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(
    (f) => feedbackCategoryFilter === "All" || f.category === feedbackCategoryFilter
  );

  // Sidebar navigation items
  const navItems = [
    { id: "overview", label: "Overview & Status", icon: Activity, badge: statusData.is_online ? "Online" : "Off" },
    { id: "slides", label: "Slide Preview Bot", icon: Layers, count: slides.length },
    { id: "sewa", label: "Manajemen Sewa Bot", icon: ShoppingBag, count: rentals.length },
    { id: "feedback", label: "Inbox Feedback", icon: MessageSquare, count: feedbacks.filter((f) => !f.is_reviewed).length },
    { id: "broadcast", label: "Broadcast Hub WA", icon: Radio },
    { id: "system", label: "Koneksi Supabase DB", icon: Database },
  ] as const;

  // =========================================================================
  // VIEW 1: STANDALONE LOGIN SCREEN (EMAIL & PASSWORD)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182708_1px,transparent_1px),linear-gradient(to_bottom,#11182708_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <header className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-zinc-900/60 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="h-4 w-4" />
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              VamxBotz <span className="text-zinc-600">/</span> Console
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Website</span>
          </Link>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[420px] rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-8 sm:p-9 shadow-2xl backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/30 text-emerald-400 mx-auto mb-5 shadow-inner">
              <Shield className="h-6 w-6" />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
              <p className="text-xs text-zinc-400 mt-1.5">
                Autentikasi keamanan manajemen bot & database.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email Admin:
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@vamxbotz.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700/80 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Password:
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password admin"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700/80 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 mt-2"
              >
                <Unlock className="h-4 w-4" />
                <span>Masuk ke Console</span>
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-zinc-800/80 text-left space-y-1">
              <span className="text-[11px] text-zinc-400 block font-medium">Default Master Kredensial:</span>
              <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 font-mono text-[11px] space-y-0.5 text-zinc-400">
                <div>Email: <strong className="text-emerald-400">admin@vamxbotz.com</strong></div>
                <div>Password: <strong className="text-emerald-400">vamxadmin2026</strong></div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 py-5 text-center text-xs text-zinc-600 border-t border-zinc-900/60">
          VamxBotz Internal Console &bull; Restricted Access &bull; &copy; 2026 Vamz Spectre
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STANDALONE ADMIN CONSOLE WITH PROFESSIONAL LEFT SIDEBAR
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDEBAR (STICKY & COLLAPSIBLE ON MOBILE)
          ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 backdrop-blur-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                VamxBotz
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Console
                </span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Supabase DB
              </span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Navigasi Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                  <span>{item.label}</span>
                </div>

                {"badge" in item && item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                    {item.badge}
                  </span>
                )}

                {"count" in item && typeof item.count === "number" && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      item.count > 0
                        ? "bg-emerald-500 text-zinc-950 font-bold"
                        : "bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Profile & External Actions */}
        <div className="p-4 border-t border-zinc-900 space-y-3 bg-zinc-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {adminEmail.slice(0, 1).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="block text-xs font-semibold text-zinc-200 truncate">
                  {adminEmail}
                </span>
                <span className="block text-[10px] text-emerald-400 font-mono">Superadmin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Buka Web Docs</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              onClick={loadAllData}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT MAIN CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar on Right Area */}
        <header className="h-16 px-4 sm:px-8 border-b border-zinc-900 bg-zinc-950/70 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Console</span>
                <span className="text-zinc-600">/</span>
                <h1 className="text-sm font-bold text-white capitalize">
                  {activeTab === "overview" && "Overview & Live Status Bot"}
                  {activeTab === "slides" && "Kelola Slide Preview Bot"}
                  {activeTab === "sewa" && "Manajemen Grup Sewa Bot"}
                  {activeTab === "feedback" && "Inbox Feedback Pengunjung"}
                  {activeTab === "broadcast" && "WhatsApp Broadcast Hub"}
                  {activeTab === "system" && "Detail Koneksi Supabase DB"}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadAllData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* ─────────────────────────────────────────────────────────
                TAB 1: OVERVIEW & STATUS BOT
                ───────────────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-xs uppercase font-medium">Status Operasional</span>
                      <Activity className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          statusData.is_online ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                        }`}
                      />
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {statusData.is_online ? "ONLINE" : "MAINTENANCE"}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                      Mode: {statusData.mode} &bull; v{statusData.version}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-xs uppercase font-medium">Grup Tersewa</span>
                      <ShoppingBag className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {rentals.filter((r) => r.status === "active").length} Grup Aktif
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      Total tercatat: {rentals.length}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-xs uppercase font-medium">Total User</span>
                      <Users className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {statusData.total_users.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">Pengguna WhatsApp</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-xs uppercase font-medium">Total Hit Command</span>
                      <Zap className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {statusData.total_hits.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">Eksekusi perintah bot</span>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
                    <div>
                      <h2 className="text-base font-bold text-white">Update Data Live Bot (Supabase)</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Perubahan di sini langsung tersimpan ke tabel <code>bot_status</code> di Supabase.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-950 text-emerald-400 border border-zinc-800">
                      Sync Realtime
                    </span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Online Toggle */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                        <label className="block text-xs font-medium text-zinc-400 mb-2">Status Online:</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setStatusData({ ...statusData, is_online: true })}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                              statusData.is_online
                                ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm"
                                : "bg-zinc-900 text-zinc-400"
                            }`}
                          >
                            🟢 Online
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatusData({ ...statusData, is_online: false })}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                              !statusData.is_online
                                ? "bg-red-500 text-white font-bold shadow-sm"
                                : "bg-zinc-900 text-zinc-400"
                            }`}
                          >
                            🔴 Offline
                          </button>
                        </div>
                      </div>

                      {/* Mode */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                        <label className="block text-xs font-medium text-zinc-400 mb-2">Mode Bot:</label>
                        <select
                          value={statusData.mode}
                          onChange={(e) => setStatusData({ ...statusData, mode: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                        >
                          <option value="Public">Public (Semua Pengguna)</option>
                          <option value="Self">Self (Khusus Owner)</option>
                          <option value="Premium Only">Premium Only</option>
                        </select>
                      </div>

                      {/* Version */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                        <label className="block text-xs font-medium text-zinc-400 mb-2">Versi Bot:</label>
                        <input
                          type="text"
                          value={statusData.version}
                          onChange={(e) => setStatusData({ ...statusData, version: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Total Pengguna (Users):
                        </label>
                        <input
                          type="number"
                          value={statusData.total_users}
                          onChange={(e) =>
                            setStatusData({ ...statusData, total_users: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono"
                        />
                      </div>

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
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Total Hit Perintah:
                        </label>
                        <input
                          type="number"
                          value={statusData.total_hits}
                          onChange={(e) =>
                            setStatusData({ ...statusData, total_hits: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={statusSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        <span>{statusSaving ? "Menyimpan ke Supabase..." : "Simpan & Sinkronkan ke Supabase"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                TAB: KELOLA SLIDE PREVIEW BOT (SHOWCASE)
                ───────────────────────────────────────────────────────── */}
            {activeTab === "slides" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Kelola Slide Preview Bot (Model Numpuk)
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Atur gambar, teks, badge, dan urutan kartu slide showcase yang tampil di halaman utama.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddSlideOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all shadow-sm shadow-emerald-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Slide Baru</span>
                  </button>
                </div>

                {/* Modal Tambah Slide */}
                {isAddSlideOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                        <h3 className="font-bold text-base text-white">Tambah Slide Preview Baru</h3>
                        <button
                          onClick={() => setIsAddSlideOpen(false)}
                          className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddSlide} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Judul Slide:
                          </label>
                          <input
                            type="text"
                            required
                            value={newSlide.title}
                            onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                            placeholder="Misal: Promo Sewa Bot Diskon 50%"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Deskripsi / Subtitle:
                          </label>
                          <input
                            type="text"
                            required
                            value={newSlide.subtitle}
                            onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                            placeholder="Penjelasan singkat fitur atau info slide..."
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">
                              Badge Teks:
                            </label>
                            <input
                              type="text"
                              required
                              value={newSlide.badge}
                              onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                              placeholder="Misal: Official Avatar / Promo"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">
                              Tag Kanan Atas:
                            </label>
                            <input
                              type="text"
                              required
                              value={newSlide.tag}
                              onChange={(e) => setNewSlide({ ...newSlide, tag: e.target.value })}
                              placeholder="v1.2.0 • Active"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">
                              Tipe Tampilan:
                            </label>
                            <select
                              value={newSlide.type}
                              onChange={(e) =>
                                setNewSlide({
                                  ...newSlide,
                                  type: e.target.value as "image-hero" | "chat-mockup",
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                            >
                              <option value="image-hero">Image Banner (Foto Avatar)</option>
                              <option value="chat-mockup">Chat Simulation (WA UI)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">
                              Urutan Tampil:
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={newSlide.sort_order}
                              onChange={(e) =>
                                setNewSlide({ ...newSlide, sort_order: Number(e.target.value) })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                            />
                          </div>
                        </div>

                        {newSlide.type === "image-hero" && (
                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">
                              Path / URL Gambar:
                            </label>
                            <input
                              type="text"
                              value={newSlide.image_src}
                              onChange={(e) => setNewSlide({ ...newSlide, image_src: e.target.value })}
                              placeholder="/images/bot-avatar.jpg atau https://..."
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 font-mono"
                            />
                            <p className="text-[10px] text-zinc-500 mt-1">
                              Gunakan <code>/images/bot-avatar.jpg</code> untuk gambar default bot atau URL gambar eksternal.
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddSlideOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs bg-zinc-900 text-zinc-400"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
                          >
                            Simpan ke Supabase
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Slides Grid View */}
                {slidesLoading ? (
                  <div className="p-8 text-center text-xs text-zinc-500">Memuat slide...</div>
                ) : slides.length === 0 ? (
                  <div className="p-12 text-center text-xs text-zinc-500 rounded-3xl border border-zinc-800 bg-zinc-900/20">
                    Belum ada slide tersimpan di database. Klik tombol di atas untuk menambahkan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slides.map((s) => (
                      <div
                        key={s.id}
                        className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                          s.is_active
                            ? "border-emerald-500/30 bg-zinc-900/50 shadow-md shadow-emerald-500/5"
                            : "border-zinc-800 bg-zinc-950/40 opacity-60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-emerald-400 font-bold">
                              Slide #{s.sort_order}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {s.type}
                            </span>
                          </div>

                          {s.type === "image-hero" && s.image_src && (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3 border border-zinc-800 bg-zinc-950">
                              <img
                                src={s.image_src}
                                alt={s.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <h3 className="font-bold text-sm text-white mb-1">{s.title}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed mb-4">{s.subtitle}</p>

                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mb-2">
                            <span>Badge: {s.badge}</span>
                            <span>&bull;</span>
                            <span>Tag: {s.tag}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleSlideActive(s.id, s.is_active)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              s.is_active
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {s.is_active ? "Aktif di Web" : "Nonaktif"}
                          </button>

                          <button
                            onClick={() => handleDeleteSlide(s.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Hapus Slide"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                TAB 3: MANAJEMEN SEWA BOT (CRM)
                ───────────────────────────────────────────────────────── */}
            {activeTab === "sewa" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Daftar Pelanggan Sewa Bot</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Kelola status langganan grup WhatsApp dan buat pesan penagihan otomatis.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                      <input
                        type="text"
                        value={rentalSearch}
                        onChange={(e) => setRentalSearch(e.target.value)}
                        placeholder="Cari grup / nama..."
                        className="pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500"
                      />
                    </div>

                    <button
                      onClick={() => setIsAddRentalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all shadow-sm shadow-emerald-500/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Penyewa</span>
                    </button>
                  </div>
                </div>

                {/* Modal Tambah Penyewa */}
                {isAddRentalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                        <h3 className="font-bold text-base text-white">Catat Klien Sewa Baru</h3>
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
                            Nama Pemesan:
                          </label>
                          <input
                            type="text"
                            required
                            value={newRental.client_name}
                            onChange={(e) => setNewRental({ ...newRental, client_name: e.target.value })}
                            placeholder="Misal: Andi Store"
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
                              onChange={(e) => setNewRental({ ...newRental, phone_number: e.target.value })}
                              placeholder="62812345678"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">
                              Nama Grup:
                            </label>
                            <input
                              type="text"
                              required
                              value={newRental.group_name}
                              onChange={(e) => setNewRental({ ...newRental, group_name: e.target.value })}
                              placeholder="Komunitas Olshop ID"
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1">Paket:</label>
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
                              Jatuh Tempo (Expired):
                            </label>
                            <input
                              type="date"
                              required
                              value={newRental.end_date}
                              onChange={(e) => setNewRental({ ...newRental, end_date: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddRentalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs bg-zinc-900 text-zinc-400"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
                          >
                            Simpan ke Database
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
                  {rentalsLoading ? (
                    <div className="p-8 text-center text-xs text-zinc-500">Memuat data sewa...</div>
                  ) : filteredRentals.length === 0 ? (
                    <div className="p-12 text-center text-xs text-zinc-500">
                      Tidak ada data penyewa yang sesuai.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-300">
                        <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                          <tr>
                            <th className="px-5 py-3.5">Klien & Grup</th>
                            <th className="px-4 py-3.5">WhatsApp</th>
                            <th className="px-4 py-3.5">Paket</th>
                            <th className="px-4 py-3.5">Biaya</th>
                            <th className="px-4 py-3.5">Jatuh Tempo</th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="px-5 py-3.5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 font-sans">
                          {filteredRentals.map((r) => {
                            const isExpired = new Date(r.end_date) < new Date();
                            return (
                              <tr key={r.id} className="hover:bg-zinc-850/40 transition-colors">
                                <td className="px-5 py-3.5">
                                  <span className="font-semibold text-zinc-100 block">{r.client_name}</span>
                                  <span className="text-[11px] text-zinc-500">{r.group_name}</span>
                                </td>
                                <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                                  +{r.phone_number}
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-emerald-400 border border-zinc-700">
                                    {r.package_type}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 font-mono text-zinc-200">
                                  Rp {r.price.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 font-mono text-[11px]">
                                  <span className={isExpired ? "text-red-400 font-bold" : "text-zinc-300"}>
                                    {r.end_date}
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
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                  >
                                    <Send className="h-3 w-3" />
                                    <span>Tagihan WA</span>
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

            {/* ─────────────────────────────────────────────────────────
                TAB 3: INBOX FEEDBACK
                ───────────────────────────────────────────────────────── */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Inbox Feedback Pengunjung</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Pesan saran, keluhan bug, dan request fitur yang masuk dari website.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {["All", "Fitur Baru", "Bug", "Pertanyaan", "Sewa Bot"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFeedbackCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          feedbackCategoryFilter === cat
                            ? "bg-emerald-500 text-zinc-950 font-bold"
                            : "bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {feedbackLoading ? (
                  <div className="p-8 text-center text-xs text-zinc-500">Memuat pesan feedback...</div>
                ) : filteredFeedbacks.length === 0 ? (
                  <div className="p-12 rounded-3xl border border-zinc-800 bg-zinc-900/20 text-center text-xs text-zinc-500">
                    Tidak ada pesan dalam kategori ini.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFeedbacks.map((f) => (
                      <div
                        key={f.id}
                        className={`p-5 rounded-3xl border transition-all ${
                          f.is_reviewed
                            ? "border-zinc-800/80 bg-zinc-950/40 opacity-70"
                            : "border-emerald-500/30 bg-zinc-900/70 shadow-lg shadow-emerald-500/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-100">{f.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                              {f.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(f.created_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80 mb-3 whitespace-pre-wrap">
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
                              className="p-1 rounded-lg text-zinc-500 hover:text-red-400"
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

            {/* ─────────────────────────────────────────────────────────
                TAB 4: BROADCAST HUB WA
                ───────────────────────────────────────────────────────── */}
            {activeTab === "broadcast" && (
              <div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-lg font-bold text-white">Generator Broadcast WhatsApp</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Buat teks pengumuman rapi dengan format WhatsApp siap disalin atau dikirim lewat bot.
                    </p>
                  </div>
                  <Radio className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Judul Broadcast:</label>
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

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 text-zinc-950 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  {copiedBroadcast ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedBroadcast ? "Tersalin ke Clipboard!" : "Salin Format WhatsApp"}</span>
                </button>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                TAB 5: SYSTEM & DATABASE INFO
                ───────────────────────────────────────────────────────── */}
            {activeTab === "system" && (
              <div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Instance Database Supabase</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Informasi instance database cloud Supabase yang terhubung secara realtime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                    <span className="text-xs text-zinc-500 block mb-1">Project Ref</span>
                    <span className="text-sm font-mono text-white font-bold">qowkaiuljwkusgwnslwg</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                    <span className="text-xs text-zinc-500 block mb-1">Region Server</span>
                    <span className="text-sm font-mono text-emerald-400 font-bold">ap-southeast-1 (Singapore)</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                    <span className="text-xs text-zinc-500 block mb-1">Database Name</span>
                    <span className="text-sm font-mono text-white font-bold">vamxbotz-db</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                    <span className="text-xs text-zinc-500 block mb-1">Organisasi Supabase</span>
                    <span className="text-sm font-mono text-white font-bold">vamxbotz</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="text-xs font-semibold text-zinc-300 block">Tabel Database Terdaftar:</span>
                  <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <strong className="text-emerald-400">bot_status</strong> &mdash; Status live & metrics bot</li>
                    <li>&bull; <strong className="text-emerald-400">bot_rentals</strong> &mdash; CRM catatan penyewa grup WhatsApp</li>
                    <li>&bull; <strong className="text-emerald-400">bot_feedback</strong> &mdash; Saran & laporan dari website</li>
                    <li>&bull; <strong className="text-emerald-400">command_logs</strong> &mdash; Log eksekusi perintah bot</li>
                  </ul>
                </div>

                <a
                  href="https://supabase.com/dashboard/project/qowkaiuljwkusgwnslwg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-850 hover:bg-zinc-800 text-white border border-zinc-700 transition-all"
                >
                  <span>Buka Supabase Web Dashboard</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
