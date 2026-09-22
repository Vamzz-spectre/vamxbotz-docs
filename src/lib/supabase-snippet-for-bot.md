# Snippet Integrasi VamxBotz WhatsApp -> Supabase / Docs

Website dokumentasi Anda sekarang sudah live di:
**https://vamxbotz-docs.vercel.app**

Endpoint status API live:
`POST https://vamxbotz-docs.vercel.app/api/status`

### Cara agar Bot WhatsApp mengupdate status online / ping secara otomatis:

Cukup panggil fungsi ini di script bot Anda (misal di `index.js` setiap 60 detik atau saat bot siap):

```javascript
async function pingDocsStatus(stats = {}) {
  try {
    const res = await fetch("https://vamxbotz-docs.vercel.app/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_online: true,
        mode: "Public",
        total_users: stats.total_users || 1420,
        total_groups: stats.total_groups || 89,
        total_hits: stats.total_hits || 45210,
        uptime_seconds: process.uptime()
      })
    });
    const result = await res.json();
    console.log("[DOCS PING]", result);
  } catch (err) {
    console.error("[DOCS PING ERROR]", err.message);
  }
}

// Jalankan saat start dan interval tiap 5 menit:
pingDocsStatus();
setInterval(pingDocsStatus, 5 * 60 * 1000);
```
