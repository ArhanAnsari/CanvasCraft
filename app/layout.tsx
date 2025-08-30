// app/layout.tsx
import "./styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/useAuth";

export const metadata = {
  title: "CanvasCraft",
  description: "Collaborative AI-powered site builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-6 py-8">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
