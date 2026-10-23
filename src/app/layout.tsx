import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  display: "swap",
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter-next",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Brew Desk",
  description: "AMS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
