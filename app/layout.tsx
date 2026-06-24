import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/shared/BottomNav";

export const metadata: Metadata = {
  title: "Tennis Matchmaker",
  description: "Auto-matchmaking for tennis open play sessions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="mx-auto max-w-md px-4 pb-20 pt-8">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
