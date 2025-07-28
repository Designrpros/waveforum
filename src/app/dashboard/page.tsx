"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react'; // Added useState import
import styled, { useTheme } from 'styled-components';
import {
  UploadCloud, DollarSign, BarChart2, Award, Users,
  Link, Image as ImageIcon, Video, Music, Settings,
  Key, Cloud, FileText, Globe, Calendar, Percent,
  CreditCard, User, Bell, Shield, Download, Lock,
  ListMusic, Radio, MessageSquare, BookOpen, Layers,
  LayoutDashboard,
} from 'lucide-react';

// --- Reused & Adapted Styled Components for Consistency ---
const Section = styled.section`
  padding-top: 4rem;
  padding-bottom: 4rem;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
`;

const DashboardLayout = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 2rem;
  padding-bottom: 4rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Sidebar = styled.aside`
  width: 100%;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem;
  padding: 1.5rem;
  flex-shrink: 0; /* Prevent shrinking */

  @media (min-width: 1024px) {
    width: 250px; /* Fixed width for sidebar on desktop */
    position: sticky;
    top: 6rem; /* Adjust based on header height */
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarNavLink = styled.a<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: ${({ theme, $isActive }) => ($isActive ? theme.primaryButtonTextColor : theme.text)};
  background-color: ${({ theme, $isActive }) => ($isActive ? theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0] : 'transparent')};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[1] : theme.buttonHoverBg)};
    color: ${({ theme, $isActive }) => ($isActive ? theme.primaryButtonTextColor : theme.text)};
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const DashboardSectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  margin-top: 2rem; /* Spacing between sections */

  &:first-of-type {
    margin-top: 0;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const StyledFeatureCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const FeatureCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FeatureIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  flex-shrink: 0;
`;

const FeatureCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const FeatureCardDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.4;
`;

// Helper Component for Feature Cards
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <StyledFeatureCard>
      <FeatureCardHeader>
        <FeatureIconWrapper>{icon}</FeatureIconWrapper>
        <FeatureCardTitle>{title}</FeatureCardTitle>
      </FeatureCardHeader>
      <FeatureCardDescription>{description}</FeatureCardDescription>
    </StyledFeatureCard>
  );
};

const DashboardPage: NextPage = () => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('overview'); // State for active sidebar link

  return (
    <>
      <Head>
        <title>Dashboard - WaveForum Artist Portal</title>
        <meta name="description" content="Manage your music, view analytics, and access artist tools on the WaveForum dashboard." />
      </Head>
      <DashboardLayout>
        <Sidebar>
          <SidebarNav>
            <SidebarNavLink href="#overview" $isActive={activeSection === 'overview'} onClick={() => setActiveSection('overview')}>
              <LayoutDashboard size={20} /> Overview
            </SidebarNavLink>
            <SidebarNavLink href="#releases" $isActive={activeSection === 'releases'} onClick={() => setActiveSection('releases')}>
              <Music size={20} /> Releases
            </SidebarNavLink>
            <SidebarNavLink href="#earnings" $isActive={activeSection === 'earnings'} onClick={() => setActiveSection('earnings')}>
              <DollarSign size={20} /> Earnings
            </SidebarNavLink>
            <SidebarNavLink href="#promo" $isActive={activeSection === 'promo'} onClick={() => setActiveSection('promo')}>
              <Globe size={20} /> Promotion
            </SidebarNavLink>
            <SidebarNavLink href="#analytics" $isActive={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')}>
              <BarChart2 size={20} /> Analytics
            </SidebarNavLink>
            <SidebarNavLink href="#content" $isActive={activeSection === 'content'} onClick={() => setActiveSection('content')}>
              <Layers size={20} /> Content & Rights
            </SidebarNavLink>
            <SidebarNavLink href="#account" $isActive={activeSection === 'account'} onClick={() => setActiveSection('account')}>
              <User size={20} /> Account
            </SidebarNavLink>
          </SidebarNav>
        </Sidebar>

        <MainContent>
          <Section id="overview">
            <DashboardSectionTitle>Dashboard Overview</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<UploadCloud size={20} />}
                title="New Release"
                description="Upload your next song or album and get it distributed worldwide."
              />
              <FeatureCard
                icon={<BarChart2 size={20} />}
                title="View Analytics"
                description="Check your latest streaming and sales statistics."
              />
              <FeatureCard
                icon={<DollarSign size={20} />}
                title="Current Earnings"
                description="See your accumulated royalties and manage payouts."
              />
              <FeatureCard
                icon={<Link size={20} />}
                title="Create HyperFollow"
                description="Generate a smart link for your new release to share everywhere."
              />
            </FeatureGrid>
          </Section>

          <Section id="releases">
            <DashboardSectionTitle>Release Management</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<UploadCloud size={20} />}
                title="Upload New Music"
                description="Distribute unlimited songs and albums to all major platforms."
              />
              <FeatureCard
                icon={<Calendar size={20} />}
                title="Schedule Release Date"
                description="Set custom release and pre-order dates for your upcoming music."
              />
              <FeatureCard
                icon={<ListMusic size={20} />}
                title="Manage Existing Releases"
                description="Edit metadata, artwork, and distribution for your uploaded tracks."
              />
              <FeatureCard
                icon={<Award size={20} />}
                title="Custom Label Name"
                description="Brand your releases with your own custom label name."
              />
              <FeatureCard
                icon={<Percent size={20} />}
                title="iTunes Pricing"
                description="Control the pricing of your music on iTunes."
              />
            </FeatureGrid>
          </Section>

          <Section id="earnings">
            <DashboardSectionTitle>Earnings & Royalties</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<DollarSign size={20} />}
                title="View All Earnings"
                description="Access detailed reports of your accumulated royalties and sales."
              />
              <FeatureCard
                icon={<Percent size={20} />}
                title="Manage Royalty Splits"
                description="Set up automatic royalty payments to your collaborators."
              />
              <FeatureCard
                icon={<CreditCard size={20} />}
                title="Payment & Withdrawal"
                description="Manage your payment methods and initiate payouts."
              />
              <FeatureCard
                icon={<Video size={20} />}
                title="YouTube Monetization"
                description="Monetize your music videos from ads and YouTube Music subscribers."
              />
            </FeatureGrid>
          </Section>

          <Section id="promo">
            <DashboardSectionTitle>Promotion & Marketing</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<Link size={20} />}
                title="HyperFollow Links"
                description="Generate smart landing pages for your music with pre-save options."
              />
              <FeatureCard
                icon={<ImageIcon size={20} />}
                title="Promo Cards"
                description="Create shareable graphics for your social media campaigns."
              />
              <FeatureCard
                icon={<Video size={20} />}
                title="Mini Videos / Visualizers"
                description="Generate short, engaging video clips for your tracks."
              />
              <FeatureCard
                icon={<Globe size={20} />}
                title="Playlist Submission"
                description="Submit your music for consideration on curated playlists within Waveform."
              />
              <FeatureCard
                icon={<MessageSquare size={20} />}
                title="Fan Engagement Tools"
                description="(Coming Soon) Connect directly with your listeners and community."
              />
              <FeatureCard
                icon={<BookOpen size={20} />}
                title="Lyrics Management"
                description="Add and sync lyrics for your songs across streaming platforms."
              />
            </FeatureGrid>
          </Section>

          <Section id="analytics">
            <DashboardSectionTitle>Analytics & Insights</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<BarChart2 size={20} />}
                title="Streaming & Sales Stats"
                description="Access detailed daily and historical performance data."
              />
              <FeatureCard
                icon={<Users size={20} />}
                title="Audience Demographics"
                description="(Coming Soon) Understand who your listeners are and where they're located."
              />
              <FeatureCard
                icon={<Globe size={20} />}
                title="Platform Access"
                description="Get instant access to Spotify for Artists, Apple Music for Artists, and more."
              />
            </FeatureGrid>
          </Section>

          <Section id="content">
            <DashboardSectionTitle>Content Management & Rights</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<Key size={20} />}
                title="ISRC & UPC Codes"
                description="Automatically assigned and managed unique identifiers for your music."
              />
              <FeatureCard
                icon={<FileText size={20} />}
                title="Cover Song Licensing"
                description="Easily obtain necessary licenses for releasing cover songs."
              />
              <FeatureCard
                icon={<Lock size={20} />}
                title="Content Protection (DistroLock)"
                description="Protect your music from unauthorized releases and re-releases."
              />
              <FeatureCard
                icon={<Cloud size={20} />}
                title="Vault (Unlimited Backups)"
                description="Securely store unlimited backups of all your uploaded audio and assets."
              />
              <FeatureCard
                icon={<Video size={20} />}
                title="YouTube Content ID"
                description="Manage content ID for your music on YouTube to prevent unauthorized use."
              />
            </FeatureGrid>
          </Section>

          <Section id="account">
            <DashboardSectionTitle>Account & Settings</DashboardSectionTitle>
            <FeatureGrid>
              <FeatureCard
                icon={<User size={20} />}
                title="Profile Management"
                description="Edit your artist bio, images, and social media links."
              />
              <FeatureCard
                icon={<Settings size={20} />}
                title="Subscription & Billing"
                description="View your current plan, upgrade, or manage billing information."
              />
              <FeatureCard
                icon={<Users size={20} />}
                title="Multi-Artist Accounts"
                description="(Premium Feature) Manage multiple artists or bands under one account."
              />
              <FeatureCard
                icon={<Shield size={20} />}
                title="Security Settings"
                description="Manage your password, two-factor authentication, and account security."
              />
              <FeatureCard
                icon={<Bell size={20} />}
                title="Notifications"
                description="Configure your notification preferences for releases, earnings, and updates."
              />
            </FeatureGrid>
          </Section>
        </MainContent>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
