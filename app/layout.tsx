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
  title: "CanvasCraft | Creative Site Builder",
  description: "Build stunning websites collaboratively with Appwrite backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

// import "@/styles/globals.css";
// import { Navbar } from "@/components/navbar";
// import { Footer } from "@/components/footer";
// import { ThemeProvider } from "next-themes";
// import { ToastProvider } from "@/components/toast-provider";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
// return (
// <html lang="en" suppressHydrationWarning>
// <body className="bg-background text-foreground min-h-screen flex flex-col">
// <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
// <ToastProvider>
// <Navbar />
// <main className="flex-1 container mx-auto p-6">{children}</main>
// <Footer />
// </ToastProvider>
// </ThemeProvider>
// </body>
// </html>
// );
// }