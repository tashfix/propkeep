import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "PropKeep — Property Maintenance Dashboard",
  description: "Never miss a repair. Never lose a receipt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
