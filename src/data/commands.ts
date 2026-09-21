export type CommandCategory =
  | "All"
  | "Group"
  | "Broadcast Group"
  | "Push Kontak"
  | "Downloader"
  | "Converter"
  | "Sticker"
  | "Pengingat Kelas"
  | "Control / Owner"
  | "Random & AI";

export interface CommandItem {
  name: string;
  category: Exclude<CommandCategory, "All">;
  syntax: string;
  description: string;
  permission: "Public" | "Admin" | "Owner";
  tags?: string[];
  example?: string;
}

export const commandsData: CommandItem[] = [
  // --- GROUP MENU ---
  {
    name: "hidetag",
    category: "Group",
    syntax: ".hidetag <pesan>",
    description: "Mention semua member grup secara tersembunyi (invisible tag).",
    permission: "Admin",
    example: ".hidetag Pengumuman penting hari ini!",
  },
  {
    name: "tagall",
    category: "Group",
    syntax: ".tagall <pesan>",
    description: "Mention dan tag seluruh anggota grup dalam satu pesan teks.",
    permission: "Admin",
    example: ".tagall kumpul mabar malam ini",
  },
  {
    name: "antilink",
    category: "Group",
    syntax: ".antilink <on|off|kick|3>",
    description: "Proteksi link grup WhatsApp. Menghapus pesan link atau kick otomatis.",
    permission: "Admin",
    example: ".antilink on",
  },
  {
    name: "antilinkdel",
    category: "Group",
    syntax: ".antilinkdel <on|off>",
    description: "Hapus otomatis pesan yang mengandung tautan tanpa mengeluarkan member.",
    permission: "Admin",
    example: ".antilinkdel on",
  },
  {
    name: "kick",
    category: "Group",
    syntax: ".kick @user / reply",
    description: "Mengeluarkan member yang melanggar aturan dari grup.",
    permission: "Admin",
    example: ".kick @6281234567890",
  },
  {
    name: "promote",
    category: "Group",
    syntax: ".promote @user / reply",
    description: "Menaikkan jabatan anggota biasa menjadi admin grup.",
    permission: "Admin",
    example: ".promote @6281234567890",
  },
  {
    name: "demote",
    category: "Group",
    syntax: ".demote @user / reply",
    description: "Menurunkan jabatan admin menjadi anggota biasa.",
    permission: "Admin",
    example: ".demote @6281234567890",
  },
  {
    name: "welcome",
    category: "Group",
    syntax: ".welcome <on|off>",
    description: "Mengaktifkan atau menonaktifkan pesan sambutan member baru.",
    permission: "Admin",
    example: ".welcome on",
  },
  {
    name: "setwelcome",
    category: "Group",
    syntax: ".setwelcome <teks>",
    description: "Kustomisasi teks sambutan (gunakan variabel @user dan @group).",
    permission: "Admin",
    example: ".setwelcome Selamat datang @user di @group!",
  },
  {
    name: "left",
    category: "Group",
    syntax: ".left <on|off>",
    description: "Mengaktifkan atau menonaktifkan ucapan perpisahan saat member keluar.",
    permission: "Admin",
    example: ".left on",
  },
  {
    name: "antinsfw",
    category: "Group",
    syntax: ".antinsfw <on|off|kick|3>",
    description: "Proteksi terhadap konten pornografi/NSFW di dalam grup.",
    permission: "Admin",
    example: ".antinsfw on",
  },
  {
    name: "delete / del",
    category: "Group",
    syntax: ".del (reply pesan)",
    description: "Menghapus pesan bot atau pesan member grup (jika bot adalah admin).",
    permission: "Admin",
    example: ".del",
  },
  {
    name: "upswgc",
    category: "Group",
    syntax: ".upswgc <caption / media>",
    description: "Upload status WhatsApp grup secara langsung lewat bot.",
    permission: "Admin",
    example: ".upswgc Info turnamen",
  },

  // --- BROADCAST GROUP ---
  {
    name: "jpm",
    category: "Broadcast Group",
    syntax: ".jpm <pesan/teks>",
    description: "Jual Promosi Masal: Mengirim pesan promosi ke seluruh grup yang dimasuki bot.",
    permission: "Owner",
    example: ".jpm Open Sewa Bot WhatsApp Termurah!",
  },
  {
    name: "jpmht",
    category: "Broadcast Group",
    syntax: ".jpmht <pesan/teks>",
    description: "Kirim JPM sekaligus tag seluruh anggota (hidetag) di semua grup.",
    permission: "Owner",
    example: ".jpmht Promo Spesial Hari Ini!",
  },
  {
    name: "jpmslide",
    category: "Broadcast Group",
    syntax: ".jpmslide",
    description: "Kirim promosi interaktif model slide/carousel ke semua grup.",
    permission: "Owner",
  },
  {
    name: "bcgc",
    category: "Broadcast Group",
    syntax: ".bcgc <pesan>",
    description: "Broadcast pesan teks/media ke seluruh grup bot.",
    permission: "Owner",
    example: ".bcgc Update bot terbaru telah rilis.",
  },
  {
    name: "listgc",
    category: "Broadcast Group",
    syntax: ".listgc",
    description: "Menampilkan daftar seluruh grup yang diikuti bot beserta jumlah member & ID.",
    permission: "Owner",
  },
  {
    name: "cekidgc",
    category: "Broadcast Group",
    syntax: ".cekidgc",
    description: "Melihat ID unik (JID) dari grup yang sedang dibuka.",
    permission: "Public",
  },
  {
    name: "autojpm",
    category: "Broadcast Group",
    syntax: ".autojpm <durasi_menit>",
    description: "Menjadwalkan JPM otomatis berulang secara periodik.",
    permission: "Owner",
    example: ".autojpm 60",
  },

  // --- PUSH KONTAK ---
  {
    name: "pushkontak",
    category: "Push Kontak",
    syntax: ".pushkontak <pesan>",
    description: "Kirim pesan pribadi (private chat) ke semua member di grup saat ini.",
    permission: "Owner",
    example: ".pushkontak Halo kak, save nomor ini ya!",
  },
  {
    name: "pushkontakid",
    category: "Push Kontak",
    syntax: ".pushkontakid <id_gc>|<pesan>",
    description: "Push pesan ke grup tertentu menggunakan target ID grup.",
    permission: "Owner",
    example: ".pushkontakid 120363xxx@g.us|Halo member grup!",
  },
  {
    name: "savekontak",
    category: "Push Kontak",
    syntax: ".savekontak <nama_file>",
    description: "Ekspor dan simpan seluruh nomor kontak grup ke file .vcf (VCard).",
    permission: "Owner",
    example: ".savekontak KontakGrupA",
  },
  {
    name: "tutor",
    category: "Push Kontak",
    syntax: ".tutor",
    description: "Panduan aman penggunaan fitur push kontak agar nomor terhindar dari banned.",
    permission: "Public",
  },

  // --- DOWNLOADER ---
  {
    name: "ttdl",
    category: "Downloader",
    syntax: ".ttdl <link_tiktok>",
    description: "Download video atau audio TikTok tanpa watermark dalam kualitas HD.",
    permission: "Public",
    example: ".ttdl https://vt.tiktok.com/ZSjxx/",
  },
  {
    name: "igdl",
    category: "Downloader",
    syntax: ".igdl <link_instagram>",
    description: "Download reels, postingan foto, carousels, maupun story Instagram.",
    permission: "Public",
    example: ".igdl https://www.instagram.com/reel/Cxxx/",
  },
  {
    name: "play",
    category: "Downloader",
    syntax: ".play <judul lagu>",
    description: "Cari dan download audio musik MP3 dari YouTube dengan cepat.",
    permission: "Public",
    example: ".play Denny Caknan Cundamani",
  },
  {
    name: "spotify",
    category: "Downloader",
    syntax: ".spotify <link / judul>",
    description: "Download lagu resmi dari Spotify lengkap dengan cover dan metadata.",
    permission: "Public",
    example: ".spotify https://open.spotify.com/track/xxx",
  },
  {
    name: "capcut",
    category: "Downloader",
    syntax: ".capcut <link_template>",
    description: "Download video template CapCut tanpa watermark.",
    permission: "Public",
    example: ".capcut https://www.capcut.com/t/Zs8xxx/",
  },
  {
    name: "mediafire",
    category: "Downloader",
    syntax: ".mediafire <link_mediafire>",
    description: "Download file dokumen/zip dari link MediaFire langsung ke WhatsApp.",
    permission: "Public",
    example: ".mediafire https://www.mediafire.com/file/xxx",
  },
  {
    name: "twitter",
    category: "Downloader",
    syntax: ".twitter <link_tweet>",
    description: "Download video atau GIF dari postingan X/Twitter.",
    permission: "Public",
    example: ".twitter https://x.com/user/status/123",
  },

  // --- CONVERTER & MEDIA ---
  {
    name: "removebg",
    category: "Converter",
    syntax: ".removebg (reply foto)",
    description: "Hapus background foto secara otomatis menggunakan AI.",
    permission: "Public",
  },
  {
    name: "toaudio",
    category: "Converter",
    syntax: ".toaudio (reply video)",
    description: "Ekstrak track audio dari file video menjadi format MP3.",
    permission: "Public",
  },
  {
    name: "toimg",
    category: "Converter",
    syntax: ".toimg (reply stiker)",
    description: "Ubah stiker statis WhatsApp menjadi gambar JPG/PNG.",
    permission: "Public",
  },
  {
    name: "tovid",
    category: "Converter",
    syntax: ".tovid (reply stiker gerak)",
    description: "Ubah stiker animasi/GIF menjadi format video MP4.",
    permission: "Public",
  },
  {
    name: "tourl",
    category: "Converter",
    syntax: ".tourl (reply media)",
    description: "Upload foto/video ke CDN cloud hosting dan dapatkan URL langsung.",
    permission: "Public",
  },

  // --- STICKER MENU ---
  {
    name: "sticker / s",
    category: "Sticker",
    syntax: ".s (reply foto/video/gif)",
    description: "Membuat stiker WhatsApp dari foto atau video singkat.",
    permission: "Public",
  },
  {
    name: "brat",
    category: "Sticker",
    syntax: ".brat <teks>",
    description: "Buat stiker gaya album Brat (Charli XCX) dengan teks kustom.",
    permission: "Public",
    example: ".brat vamxbotz on top",
  },
  {
    name: "bratvid",
    category: "Sticker",
    syntax: ".bratvid <teks>",
    description: "Buat stiker animasi Brat mengetik (typing effect video).",
    permission: "Public",
    example: ".bratvid lagi apa bro",
  },
  {
    name: "smeme",
    category: "Sticker",
    syntax: ".smeme <atas>|<bawah> (reply foto)",
    description: "Membuat stiker meme dengan teks atas dan bawah.",
    permission: "Public",
    example: ".smeme ketika|tugas numpuk",
  },
  {
    name: "qc",
    category: "Sticker",
    syntax: ".qc <teks>",
    description: "Generate stiker quote chat WhatsApp elegan dengan foto profil pengirim.",
    permission: "Public",
    example: ".qc Tetap semangat walau coding error",
  },

  // --- PENGINGAT KELAS ---
  {
    name: "addpr",
    category: "Pengingat Kelas",
    syntax: ".addpr <mapel>|<deadline>|<detail>",
    description: "Catat tugas/PR kelas baru ke database pengingat bot.",
    permission: "Admin",
    example: ".addpr Matematika|25 Sep|Hal 40 no 1-10",
  },
  {
    name: "addpiket",
    category: "Pengingat Kelas",
    syntax: ".addpiket <hari>|<nama-nama>",
    description: "Simpan daftar regu piket kebersihan kelas berdasarkan hari.",
    permission: "Admin",
    example: ".addpiket Senin|Fahmi, Rizky, Dimas",
  },
  {
    name: "listkelas",
    category: "Pengingat Kelas",
    syntax: ".listkelas",
    description: "Lihat ringkasan seluruh PR aktif, jadwal piket hari ini, dan agenda kelas.",
    permission: "Public",
  },
  {
    name: "addacara",
    category: "Pengingat Kelas",
    syntax: ".addacara <nama_acara>|<tanggal>",
    description: "Catat agenda kegiatan belajar atau acara kelas mendatang.",
    permission: "Admin",
    example: ".addacara Ujian Tengah Semester|01 Okt",
  },

  // --- RANDOM & AI ---
  {
    name: "remini",
    category: "Random & AI",
    syntax: ".remini (reply foto)",
    description: "Tingkatkan resolusi foto buram menjadi HD (AI Super-Resolution).",
    permission: "Public",
  },
  {
    name: "pinterest",
    category: "Random & AI",
    syntax: ".pinterest <kata kunci>",
    description: "Cari dan dapatkan gambar estetik beresolusi tinggi dari Pinterest.",
    permission: "Public",
    example: ".pinterest anime cyberpunk wallpaper",
  },
  {
    name: "cekkhodam",
    category: "Random & AI",
    syntax: ".cekkhodam <nama>",
    description: "Cek khodam lucu dan unik berdasarkan nama pengirim.",
    permission: "Public",
    example: ".cekkhodam Fahmi",
  },
  {
    name: "waifu",
    category: "Random & AI",
    syntax: ".waifu",
    description: "Dapatkan gambar karakter anime waifu secara acak.",
    permission: "Public",
  },

  // --- CONTROL / OWNER ---
  {
    name: "ping",
    category: "Control / Owner",
    syntax: ".ping",
    description: "Mengecek kecepatan respon server dan latensi bot dalam milidetik (ms).",
    permission: "Public",
  },
  {
    name: "runtime",
    category: "Control / Owner",
    syntax: ".runtime",
    description: "Melihat total waktu operasional bot dan uptime VPS saat ini.",
    permission: "Public",
  },
  {
    name: "setting",
    category: "Control / Owner",
    syntax: ".setting",
    description: "Buka panel konfigurasi bot (Mode Self/Public, Anti-call, Autoread).",
    permission: "Owner",
  },
  {
    name: "setnamabot",
    category: "Control / Owner",
    syntax: ".setnamabot <nama>",
    description: "Mengganti nama profil bot secara instan.",
    permission: "Owner",
    example: ".setnamabot VamxBotz Super",
  },
  {
    name: "setppbot",
    category: "Control / Owner",
    syntax: ".setppbot (reply foto)",
    description: "Mengganti foto profil (avatar) WhatsApp bot.",
    permission: "Owner",
  },
  {
    name: "anticall",
    category: "Control / Owner",
    syntax: ".anticall <on|off>",
    description: "Blokir atau tolak otomatis panggilan suara/video WhatsApp yang masuk ke bot.",
    permission: "Owner",
    example: ".anticall on",
  },
  {
    name: "addcase",
    category: "Control / Owner",
    syntax: ".addcase <kode case>",
    description: "Menambahkan fitur/perintah baru langsung ke file case.js tanpa restart manual.",
    permission: "Owner",
  },
  {
    name: "delcase",
    category: "Control / Owner",
    syntax: ".delcase <nama_case>",
    description: "Menghapus case perintah dari bot secara langsung via chat WhatsApp.",
    permission: "Owner",
  },
];
