// app/layout.tsx
import "./styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/useAuth";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CanvasCraft – AI-Powered Block-Based Website Builder",
  description:
    "CanvasCraft is an AI-powered, block-based website builder that helps you generate, edit, and manage responsive websites with ease. No coding required – just create and launch in minutes!",
  keywords: [
    "CanvasCraft",
    "AI Website Builder",
    "Next.js Website Builder",
    "Block Based Website Builder",
    "No Code Website Builder",
    "AI Page Generator",
    "CanvasCraft AI",
  ],
  authors: [{ name: "Arhan Ansari", url: "https://arhanansari.vercel.app/" }],
  creator: "CanvasCraft",
  publisher: "CanvasCraft",
  metadataBase: new URL("https://canvascraft.appwrite.network"),
  openGraph: {
    title: "CanvasCraft – AI-Powered Block-Based Website Builder",
    description:
      "Generate and edit websites instantly with AI. CanvasCraft helps you design, edit, and launch responsive sites with zero coding.",
    url: "https://canvascraft.appwrite.network/",
    siteName: "CanvasCraft",
    images: [
      {
        url: "https://canvascraft.appwrite.network/canvascraft-logo.png",
        width: 1200,
        height: 630,
        alt: "CanvasCraft Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanvasCraft – AI-Powered Block-Based Website Builder",
    description:
      "Generate and edit websites instantly with AI. CanvasCraft helps you design, edit, and launch responsive sites with zero coding.",
    images: ["https://canvascraft.appwrite.network/canvascraft-logo.png"],
    creator: "@codewitharhan", // your X (Twitter) handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/canvascraft-logo.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  alternates: {
    canonical: "https://canvascraft.appwrite.network/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-6 py-8">{children}</main>
          <Toaster richColors position="top-right" /> {/* ✅ global toast provider */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
