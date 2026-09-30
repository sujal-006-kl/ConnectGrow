import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ConnectGrow - Connect, Chat, Learn & Grow",
  description: "Connect with people based on a 60-40 match engine (60% common ground + 40% complementary growth goals) with AI Icebreakers and real-time chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-800 bg-slate-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-500">
          <p>© 2026 ConnectGrow. Built for meaningful human connection, skill exchange & learning.</p>
        </footer>
      </body>
    </html>
  );
}
