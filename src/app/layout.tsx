import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter font for WaveForum
import "./globals.css";
import StyledComponentsRegistry from "./lib/registry"; // Assuming you'll create this
import { ThemeLayoutClient } from '../components/ThemeLayoutClient';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WaveForum - Artist Portal",
  description: "WaveForum is the dedicated artist portal for Studio 51, enabling direct music uploads, flexible licensing, and community engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* StyledComponentsRegistry and ThemeLayoutClient are essential for styled-components */}
        <StyledComponentsRegistry>
          <ThemeLayoutClient>
            {children}
          </ThemeLayoutClient>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
