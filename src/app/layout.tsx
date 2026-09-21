import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VamxBotz Docs &mdash; Dokumentasi Resmi WhatsApp Bot",
  description: "Dokumentasi perintah, fitur otomasi grup, push kontak, downloader media, dan integrasi Supabase untuk VamxBotz.",
  keywords: ["vamxbotz", "whatsapp bot", "bot wa", "push kontak", "jpm", "dokumentasi bot", "supabase", "vercel"],
  authors: [{ name: "vamzahai" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 flex flex-col">{children}</body>
    </html>
  );
}
