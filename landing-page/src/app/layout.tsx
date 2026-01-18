import type { Metadata } from "next";
import UnicornScript from "@/components/UnicornScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liquid - Leverage Everything",
  description: "Trade from anywhere and multiply your returns by up to 150x.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        {children}
        <UnicornScript />
      </body>
    </html>
  );
}
