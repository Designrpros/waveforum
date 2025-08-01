"use client";

import React, { useState, useEffect } from 'react';
// Import 'css' for style sharing
import styled, { css } from 'styled-components';
import { Sun, Moon, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../lib/firebase';

// Main header wrapper
const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background-color: ${({ theme }) => theme.headerBg};
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  transition: background-color 0.3s ease;
`;

// Centering container
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem 1.5rem;
  gap: 1.5rem;
`;

// Logo styling
const LogoLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  flex-shrink: 0; // Prevent logo from shrinking
`;

// Container for navigation links on desktop
const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 0 auto; // This centers the nav links between the logo and actions

  @media (max-width: 768px) {
    display: none;
  }
`;

// Styling for individual desktop nav links
const NavLink = styled(Link)`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.subtleText};
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

// Container for right-side actions (auth buttons, theme toggle, menu)
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

// Wrapper for desktop-only auth buttons to hide them on mobile
const DesktopAuthActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Define shared styles for action buttons using the css helper
const actionButtonStyles = css`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap; // Prevent text wrapping

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
    border-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

// Apply the shared styles to a button
const ActionButton = styled.button`
  ${actionButtonStyles}
`;

// Apply the shared styles to a Link component
const ActionLink = styled(Link)`
  ${actionButtonStyles}
  text-decoration: none;
`;

// MODIFIED: This button now uses the theme's text and body colors.
const LoginRegisterButton = styled(ActionLink)`
    background-color: ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.body};
    border-color: ${({ theme }) => theme.text};

    &:hover {
      background-color: ${({ theme }) => theme.body};
      color: ${({ theme }) => theme.text};
      border-color: ${({ theme }) => theme.text};
    }
`;


// Theme toggle button
const ThemeToggleButton = styled.button`
  background: transparent;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.subtleText};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.buttonHoverBg};
    color: ${({ theme }) => theme.text};
  }
`;

// Hamburger menu toggle
const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  z-index: 101;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }
`;

// --- Mobile Navigation ---

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
`;

const MobileNav = styled.nav<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background-color: ${({ theme }) => theme.headerBg};
  padding: 6rem 1.5rem 2rem;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 100;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  @media (min-width: 769px) {
    display: none;
  }
`;

// Define shared styles for mobile nav items
const mobileNavLinkStyles = css`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  padding: 0.75rem 1rem;
  width: 100%;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

// Apply styles to Link
const MobileNavLink = styled(Link)`
  ${mobileNavLinkStyles}
`;

// Apply styles to button
const MobileAuthButton = styled.button`
  ${mobileNavLinkStyles}
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const MobileMenuSeparator = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.borderColor};
    margin: 1rem 0;
`;


// --- Component ---

interface HeaderProps {
  currentThemeName: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentThemeName, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavLinkClick = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      handleNavLinkClick();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const renderAuthButtons = () => {
    if (loading) return null; // Or a loading spinner
    
    return user ? (
        <>
            <ActionLink href="/settings">
                <UserIcon size={16} /> Profile
            </ActionLink>
            <ActionButton onClick={handleLogout}>
                <LogOut size={16} /> Logout
            </ActionButton>
        </>
    ) : (
        <LoginRegisterButton href="/login">
            Login / Register
        </LoginRegisterButton>
    );
  };
  
  const renderMobileNavLinks = () => {
    if (loading) return null;

    return (
        <>
            <MobileNavLink href="/community" onClick={handleNavLinkClick}>Community</MobileNavLink>
            {user && (
                <>
                    <MobileNavLink href="/dashboard" onClick={handleNavLinkClick}>Dashboard</MobileNavLink>
                    <MobileNavLink href="/upload" onClick={handleNavLinkClick}>Upload Music</MobileNavLink>
                </>
            )}
            <MobileMenuSeparator/>
            {user ? (
                <>
                    <MobileNavLink href="/settings" onClick={handleNavLinkClick}><UserIcon size={20} /> Profile</MobileNavLink>
                    <MobileAuthButton onClick={handleLogout}><LogOut size={20} /> Logout</MobileAuthButton>
                </>
            ) : (
                 <MobileNavLink href="/login" onClick={handleNavLinkClick}>Login / Register</MobileNavLink>
            )}
        </>
    );
  }


  return (
    <>
      <StyledHeader>
        <Container>
          <LogoLink href="/" onClick={handleNavLinkClick}>
            WaveForum
          </LogoLink>

          {/* Desktop Navigation Links */}
          <DesktopNav>
            <NavLink href="/community">Community</NavLink>
            {!loading && user && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/upload">Upload Music</NavLink>
              </>
            )}
          </DesktopNav>

          {/* Actions: Auth, Theme, Mobile Menu */}
          <HeaderActions>
            <DesktopAuthActions>
                {renderAuthButtons()}
            </DesktopAuthActions>
            
            <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle theme">
              {currentThemeName === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </ThemeToggleButton>

            <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuToggle>
          </HeaderActions>
        </Container>
      </StyledHeader>

      {/* Mobile Navigation Panel */}
      <MobileNav $isOpen={isMenuOpen}>
        {renderMobileNavLinks()}
      </MobileNav>

      <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </>
  );
};