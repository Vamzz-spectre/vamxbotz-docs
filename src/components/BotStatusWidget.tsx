"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { botInfo } from "@/data/bot-info";
import { Activity, Users, Shield, Zap, RefreshCw } from "lucide-react";

interface StatusData {
  is_online: boolean;
  version: string;
  mode: string;
  total_users: number;
  total_groups: number;
  total_hits: number;
  last_ping: string;
}

const defaultStatus: StatusData = {
  is_online: true,
  version: botInfo.version,
  mode: "Public",
  total_users: 1420,
  total_groups: 89,
  total_hits: 45210,
  last_ping: new Date().toISOString(),
};

export function BotStatusWidget() {
  const [status, setStatus] = useState<StatusData>(defaultStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) {
        setIsSupabaseConnected(false);
        setLoading(false);
        return;
      }

      setIsSupabaseConnected(true);
      const { data, error } = await supabase
        .from("bot_status")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setStatus(data as StatusData);
      }
    } catch {
      // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <section id="status" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Status Bot & Server</h2>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Online
          </span>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Mode Bot</span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{status.mode}</div>
          <p className="text-[11px] text-zinc-500 mt-1">v{status.version} Multi-Device</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Grup Aktif</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{status.total_groups.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Grup WhatsApp terdaftar</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total User</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{status.total_users.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Pengguna aktif terdata</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Hit Command</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{status.total_hits.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500 mt-1">
            {isSupabaseConnected ? "Live via Supabase DB" : "Default Mode"}
          </p>
        </div>
      </div>
    </section>
  );
}
