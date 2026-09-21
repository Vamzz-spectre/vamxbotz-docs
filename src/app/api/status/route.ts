import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { botInfo } from "@/data/bot-info";

export async function GET() {
  try {
    const supabase = await createClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("bot_status")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        return NextResponse.json({
          status: "success",
          source: "supabase",
          data,
        });
      }
    }

    // Default response if supabase is not connected yet
    return NextResponse.json({
      status: "success",
      source: "fallback",
      data: {
        bot_name: botInfo.name,
        version: botInfo.version,
        is_online: true,
        mode: "Public",
        total_users: 1420,
        total_groups: 89,
        total_hits: 45210,
        last_ping: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { status: "error", message: errorMessage },
      { status: 500 }
    );
  }
}
