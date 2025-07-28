"use client";

import { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider, DefaultTheme } from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';

// --- Theme Definition for WaveForum ---
const lightTheme: DefaultTheme = {
  body: '#f0ecec', // From provided Waveform.ink light theme
  text: '#1F2937', // From provided Waveform.ink light theme
  subtleText: '#6B7280', // From provided Waveform.ink light theme
  cardBg: 'rgba(255, 255, 255, 0.6)', // From provided Waveform.ink light theme
  headerBg: 'rgba(240, 236, 236, 0.7)', // From provided Waveform.ink light theme
  borderColor: 'rgba(0, 0, 0, 0.1)', // From provided Waveform.ink light theme
  buttonBg: 'rgba(0, 0, 0, 0.05)', // From provided Waveform.ink light theme
  buttonHoverBg: 'rgba(0, 0, 0, 0.1)', // From provided Waveform.ink light theme
  backgroundImage: 'url(/assets/MusicCircleLight.png)',
  imageOpacity: '1.0', // From provided Waveform.ink light theme
  accentGradient: 'linear-gradient(to right, #007bff, #0056b3)', // Blue Gradient
  secondaryButtonBorderColor: 'rgba(0, 0, 0, 0.1)', // Matches borderColor for secondary button
  primaryButtonTextColor: '#FFFFFF', // White text for primary buttons
};

const darkTheme: DefaultTheme = {
  body: '#383434', // From provided Waveform.ink dark theme
  text: '#F9FAFB', // From provided Waveform.ink dark theme
  subtleText: '#9CA3AF', // From provided Waveform.ink dark theme
  cardBg: 'rgba(56, 52, 52, 0.6)', // From provided Waveform.ink dark theme
  headerBg: 'rgba(56, 52, 52, 0.5)', // From provided Waveform.ink dark theme
  borderColor: 'rgba(255, 255, 255, 0.1)', // From provided Waveform.ink dark theme
  buttonBg: 'rgba(255, 255, 255, 0.05)', // From provided Waveform.ink dark theme
  buttonHoverBg: 'rgba(255, 255, 255, 0.1)', // From provided Waveform.ink dark theme
  backgroundImage: 'url(/assets/MusicCircle.png)',
  imageOpacity: '0.2', // From provided Waveform.ink dark theme
  accentGradient: 'linear-gradient(to right, #007bff, #0056b3)', // Blue Gradient
  secondaryButtonBorderColor: 'rgba(255, 255, 255, 0.1)', // Matches borderColor for secondary button
  primaryButtonTextColor: '#FFFFFF', // White text for primary buttons
};

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.body} !important;
    color: ${({ theme }) => theme.text} !important;
    transition: background-color 0.3s ease, color 0.3s ease;
    font-family: 'Inter', sans-serif;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  /* Layer 1: MusicCircle background */
  &::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: ${({ theme }) => theme.backgroundImage};
    background-size: cover;
    background-position: center;
    opacity: ${({ theme }) => theme.imageOpacity};
    z-index: -2;
    transition: opacity 0.5s ease;
  }
`;

interface ThemeLayoutClientProps {
  children: React.ReactNode;
}

export function ThemeLayoutClient({ children }: ThemeLayoutClientProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? 'dark' : 'light');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <PageWrapper>
        <Header currentThemeName={theme} toggleTheme={toggleTheme} />
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
        <Footer />
      </PageWrapper>
    </ThemeProvider>
  );
}