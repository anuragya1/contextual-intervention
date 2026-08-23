import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CashKaro Contextual Browser Intervention Prototype",
  description: "A responsive product assessment prototype for a contextual CashKaro MVP."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
