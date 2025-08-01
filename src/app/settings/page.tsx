// src/app/settings/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, ChangeEvent, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  User, Lock, Bell, CreditCard, Shield,
} from 'lucide-react';

// --- (Styled Components are unchanged) ---
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

const SettingsLayout = styled(Container)`
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
  flex-shrink: 0;

  @media (min-width: 1024px) {
    width: 250px;
    position: sticky;
    top: 6rem;
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
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[1] : theme.buttonHoverBg)};
    color: ${({ theme, $isActive }) => ($isActive ? theme.primaryButtonTextColor : theme.text)};
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const SettingsSectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  margin-top: 2rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SettingsCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0].replace(')', ', 0.2)')};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0].replace(')', ', 0.2)')};
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.accentGradient};
  color: ${({ theme }) => theme.primaryButtonTextColor};
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.borderColor};

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const DangerButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  border: none;

  &:hover {
    background-color: #c82333;
  }
`;

const AvatarPreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 2px solid ${({ theme }) => theme.borderColor};
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  margin-bottom: 0.5rem;

  input[type="checkbox"] {
    appearance: none;
    width: 1.1rem;
    height: 1.1rem;
    border: 2px solid ${({ theme }) => theme.borderColor};
    border-radius: 0.25rem;
    display: grid;
    place-content: center;
    transition: all 0.2s ease;

    &::before {
      content: "✓";
      font-size: 0.8rem;
      color: white;
      transform: scale(0);
      transition: transform 0.2s ease;
    }

    &:checked {
      background-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
      border-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
      &::before {
        transform: scale(1);
      }
    }
  }
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 0.5rem;
`;


const SettingsPage: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [activeSection, setActiveSection] = useState('profile');
  
  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Fetch the artist profile when the user is available
      const fetchProfile = async () => {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('http://51.175.105.40:8080/api/artist/profile', {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          if (!response.ok) throw new Error('Failed to fetch profile');
          const data = await response.json();
          setArtistName(data.name || '');
          setBio(data.bio || '');
          setAvatarPreviewUrl(data.artwork || null);
        } catch (error) {
          console.error("Could not fetch artist profile:", error);
          // Handle case where profile might not exist yet for a new user
        }
      };
      fetchProfile();
    }
  }, [user, loading, router]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to update your profile.');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const formData = new FormData();
      formData.append('name', artistName);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('artwork', avatarFile);
      }

      const response = await fetch('http://51.175.105.40:8080/api/artist/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update profile.');
      }

      alert('Profile updated successfully!');

    } catch (error: any) {
      console.error('Profile update error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password change attempt');
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  if (loading || !user) {
    return (
      <Container>
        <SettingsSectionTitle>Loading...</SettingsSectionTitle>
        <p style={{ textAlign: 'center', color: theme.subtleText }}>Checking authentication status.</p>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Settings - WaveForum Artist Portal</title>
        <meta name="description" content="Manage your WaveForum artist account settings." />
      </Head>
      <SettingsLayout>
        <Sidebar>
          <SidebarNav>
            <SidebarNavLink href="#profile" $isActive={activeSection === 'profile'} onClick={() => setActiveSection('profile')}>
              <User size={20} /> Profile
            </SidebarNavLink>
            <SidebarNavLink href="#security" $isActive={activeSection === 'security'} onClick={() => setActiveSection('security')}>
              <Lock size={20} /> Security
            </SidebarNavLink>
            <SidebarNavLink href="#notifications" $isActive={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')}>
              <Bell size={20} /> Notifications
            </SidebarNavLink>
            <SidebarNavLink href="#subscription" $isActive={activeSection === 'subscription'} onClick={() => setActiveSection('subscription')}>
              <CreditCard size={20} /> Subscription & Billing
            </SidebarNavLink>
            <SidebarNavLink href="#data-privacy" $isActive={activeSection === 'data-privacy'} onClick={() => setActiveSection('data-privacy')}>
              <Shield size={20} /> Data & Privacy
            </SidebarNavLink>
          </SidebarNav>
        </Sidebar>

        <MainContent>
          <section id="profile">
            <SettingsSectionTitle>Profile Management</SettingsSectionTitle>
            <SettingsCard>
              <form onSubmit={handleProfileSave}>
                <FormGroup>
                  <Label htmlFor="artist-avatar">Artist Avatar</Label>
                  {avatarPreviewUrl ? <AvatarPreview src={avatarPreviewUrl} alt="Artist Avatar" /> : <InfoText>No avatar uploaded.</InfoText>}
                  <Input type="file" id="artist-avatar" accept="image/*" onChange={handleAvatarChange} />
                  <InfoText>Upload a square image (min. 500x500px).</InfoText>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="artist-name">Artist Name</Label>
                  <Input
                    type="text"
                    id="artist-name"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your audience about yourself."
                  />
                </FormGroup>
                <PrimaryButton type="submit">Save Profile</PrimaryButton>
              </form>
            </SettingsCard>
          </section>

          <section id="security">
            <SettingsSectionTitle>Account Security</SettingsSectionTitle>
            <SettingsCard>
              <form onSubmit={handlePasswordChange}>
                <FormGroup>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input
                    type="password"
                    id="confirm-new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                <PrimaryButton type="submit">Change Password</PrimaryButton>
              </form>
              <hr style={{ border: `0.5px solid ${theme.borderColor}`, margin: '1rem 0' }} />
              <FormGroup>
                <Label>Two-Factor Authentication (2FA)</Label>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  />
                  Enable 2FA
                </CheckboxOption>
                <InfoText>Add an extra layer of security to your account.</InfoText>
                {twoFactorEnabled && <SecondaryButton type="button" style={{ marginTop: '1rem' }}>Setup 2FA</SecondaryButton>}
              </FormGroup>
            </SettingsCard>
          </section>

          <section id="notifications">
            <SettingsSectionTitle>Notification Preferences</SettingsSectionTitle>
            <SettingsCard>
              <FormGroup>
                <Label>Email Notifications</Label>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  Receive email updates on releases, earnings, and platform news.
                </CheckboxOption>
              </FormGroup>
              <FormGroup>
                <Label>In-App Notifications</Label>
                <CheckboxOption>
                  <input
                    type="checkbox"
                    checked={inAppNotifications}
                    onChange={() => setInAppNotifications(!inAppNotifications)}
                  />
                  Receive in-app alerts for important updates and messages.
                </CheckboxOption>
              </FormGroup>
              <PrimaryButton type="button">Save Notification Settings</PrimaryButton>
            </SettingsCard>
          </section>

          <section id="subscription">
            <SettingsSectionTitle>Subscription & Billing</SettingsSectionTitle>
            <SettingsCard>
              <FormGroup>
                <Label>Current Plan</Label>
                <InfoText>You are currently on the **Free** plan.</InfoText>
                <PrimaryButton type="button" style={{ marginTop: '1rem' }}>Upgrade to Premium</PrimaryButton>
              </FormGroup>
              <hr style={{ border: `0.5px solid ${theme.borderColor}`, margin: '1rem 0' }} />
              <FormGroup>
                <Label>Payment Methods</Label>
                <InfoText>No payment methods on file.</InfoText>
                <SecondaryButton type="button" style={{ marginTop: '1rem' }}>Add Payment Method</SecondaryButton>
              </FormGroup>
              <FormGroup>
                <Label>Billing History</Label>
                <InfoText>View your past invoices and payment history.</InfoText>
                <SecondaryButton type="button" style={{ marginTop: '1rem' }}>View Billing History</SecondaryButton>
              </FormGroup>
            </SettingsCard>
          </section>

          <section id="data-privacy">
            <SettingsSectionTitle>Data & Privacy</SettingsSectionTitle>
            <SettingsCard>
              <FormGroup>
                <Label>Export My Data</Label>
                <InfoText>Download a copy of your WaveForum data.</InfoText>
                <SecondaryButton type="button" style={{ marginTop: '1rem' }}>Export Data</SecondaryButton>
              </FormGroup>
              <FormGroup>
                <Label>Delete My Account</Label>
                <InfoText>Permanently delete your account. This action cannot be undone.</InfoText>
                <DangerButton type="button" style={{ marginTop: '1.5rem' }}>Delete Account</DangerButton>
              </FormGroup>
            </SettingsCard>
          </section>
        </MainContent>
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;