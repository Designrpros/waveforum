// src/types/styled.d.ts for WaveForum Project
import 'styled-components';

// Extend the DefaultTheme interface with custom properties for WaveForum
declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    subtleText: string;
    cardBg: string;
    headerBg: string;
    borderColor: string;
    buttonBg: string;
    buttonHoverBg: string;
    backgroundImage: string;
    imageOpacity: string;
    accentGradient: string; // Replaced primaryColor and heroGradientText
    secondaryButtonBorderColor: string; // For explicit secondary button border
    primaryButtonTextColor: string; // Explicit text color on primary buttons
    primaryBlue: string;  
    accentGradientHover: string; 
    }
}