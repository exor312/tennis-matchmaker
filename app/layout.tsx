import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/shared/BottomNav";

export const metadata: Metadata = {
  title: "MATCHMAKER",
  description: "Tennis open play matchmaking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", margin: 0 }}>
        <main className="max-w-lg mx-auto px-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
