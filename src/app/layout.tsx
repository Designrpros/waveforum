// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../lib/registry";
import { ThemeLayoutClient } from '../components/ThemeLayoutClient';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider

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
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          {/* Wrap ThemeLayoutClient (or directly children) with AuthProvider */}
          <AuthProvider> 
            <ThemeLayoutClient>
              {children}
            </ThemeLayoutClient>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}