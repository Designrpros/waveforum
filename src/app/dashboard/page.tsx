// src/app/dashboard/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud, DollarSign, BarChart2, Users,
  Music, Trash2, ChevronDown, ChevronRight,
  Edit, Shield, Download, Info
} from 'lucide-react';
import Link from 'next/link';

// --- Styled Components ---
const Container = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media (min-width: 1024px) {
    max-width: 1024px;
  }
  padding-top: 2rem;
  padding-bottom: 4rem;
`;

const DashboardSectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  margin-top: 2rem;

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

const ReleaseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AlbumItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.75rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const AlbumItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: ${({ theme }) => theme.cardBg};
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const ReleaseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
`;

const ReleaseArtwork = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const ReleaseTitle = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ReleaseStatus = styled.span<{ status: 'pending' | 'approved' | 'rejected' | 'unpublished' }>`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  color: white;
  background-color: ${props => {
    switch (props.status) {
      case 'approved': return '#28a745';
      case 'pending': return '#ffc107';
      case 'rejected': return '#dc3545';
      case 'unpublished': return '#6c757d';
      default: return '#6c757d';
    }
  }};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: ${({ theme }) => theme.subtleText};
  padding: 0.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
    color: ${({ theme }) => theme.text};
  }
`;

const DeleteButton = styled(ActionButton)`
  border-color: #dc3545;
  color: #dc3545;
  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const TrackSubList = styled.div`
  padding-left: 2rem;
  margin-top: 0.5rem;
  border-left: 2px solid ${({ theme }) => theme.borderColor};
  margin-left: 24px;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.9rem;
`;

const RejectionReasonContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  border-top: 1px solid #f5c6cb;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const RejectionReasonText = styled.p`
  margin: 0;
  flex-grow: 1;
`;

interface Track {
  id: number;
  title: string;
}

interface Release {
  id: number;
  title: string;
  artwork: string;
  tracks: Track[];
  licensing: 'cc' | 'proprietary';
  cc_type?: string;
  status: 'pending' | 'approved' | 'rejected' | 'unpublished';
  rejection_reason?: string | null;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, href }) => {
  return (
    <Link href={href} passHref>
      <StyledFeatureCard style={{ cursor: 'pointer' }}>
        <FeatureCardHeader>
          <FeatureIconWrapper>{icon}</FeatureIconWrapper>
          <FeatureCardTitle>{title}</FeatureCardTitle>
        </FeatureCardHeader>
        <FeatureCardDescription>{description}</FeatureCardDescription>
      </StyledFeatureCard>
    </Link>
  );
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [releases, setReleases] = useState<Release[]>([]);
  const [expandedAlbums, setExpandedAlbums] = useState<Record<number, boolean>>({});

  const fetchReleases = useCallback(async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artist/my-releases`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch releases');
      const data = await response.json();
      setReleases(data);
    } catch (error) {
      console.error(error);
    }
  }, [user]);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchReleases();
    }
  }, [user, loading, router, fetchReleases]);

  const toggleAlbum = (albumId: number) => {
    setExpandedAlbums(prev => ({ ...prev, [albumId]: !prev[albumId] }));
  };

  const handleDelete = async (e: React.MouseEvent, albumId: number) => {
    e.stopPropagation();
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this album? This will also delete all associated tracks and files. This action cannot be undone.')) {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/album/${albumId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (!response.ok) throw new Error('Failed to delete album');
        fetchReleases();
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the album.');
      }
    }
  };

  const handleShowLicense = (e: React.MouseEvent, release: Release) => {
    e.stopPropagation();
    if (release.licensing === 'proprietary') {
      alert(`License: Proprietary\n\nThis release is under a standard, proprietary license exclusive to WaveForum.`);
    } else {
      const licenseName = `CC ${release.cc_type} 4.0`;
      const licenseUrl = `https://creativecommons.org/licenses/${release.cc_type?.toLowerCase()}/4.0`;
      alert(`License: ${licenseName}\n\nThis release is licensed under the Creative Commons license. You can view the full terms here:\n${licenseUrl}`);
    }
  };

  if (loading || !user) {
    return (
      <Container>
        <DashboardSectionTitle>Loading...</DashboardSectionTitle>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - WaveForum Artist Portal</title>
        <meta name="description" content="Manage your music on the WaveForum dashboard." />
      </Head>
      <Container style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <section>
          <DashboardSectionTitle>Dashboard Overview</DashboardSectionTitle>
          <FeatureGrid>
            <FeatureCard
              href="/upload"
              icon={<UploadCloud size={20} />}
              title="New Release"
              description="Upload your next song or album to the platform."
            />
            <FeatureCard
              href="#analytics"
              icon={<BarChart2 size={20} />}
              title="View Analytics"
              description="Check your latest streaming statistics (coming soon)."
            />
            <FeatureCard
              href="#earnings"
              icon={<DollarSign size={20} />}
              title="Current Earnings"
              description="Manage royalties and payouts (coming soon)."
            />
            <FeatureCard
              href="/settings"
              icon={<Users size={20} />}
              title="Edit Profile"
              description="Update your artist name, bio, and artwork."
            />
          </FeatureGrid>
        </section>

        <section>
          <DashboardSectionTitle>My Releases</DashboardSectionTitle>
          <ReleaseListContainer>
            {releases.length > 0 ? releases.map(release => (
              <AlbumItem key={release.id}>
                <AlbumItemHeader onClick={() => toggleAlbum(release.id)}>
                  <ReleaseInfo>
                    {expandedAlbums[release.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <ReleaseArtwork src={release.artwork} alt={release.title} />
                    <ReleaseTitle>{release.title}</ReleaseTitle>
                    <ReleaseStatus status={release.status}>
                      {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                    </ReleaseStatus>
                  </ReleaseInfo>
                  <ActionButtonGroup>
                    <ActionButton title="Download assets (coming soon)" onClick={(e) => { e.stopPropagation(); alert('Download functionality is coming soon!'); }}>
                      <Download size={16} />
                    </ActionButton>
                    <ActionButton title="View license details" onClick={(e) => handleShowLicense(e, release)}>
                      <Shield size={16} />
                    </ActionButton>
                    <ActionButton title="Edit release (coming soon)" onClick={(e) => { e.stopPropagation(); alert('Editing releases is coming soon!'); }}>
                      <Edit size={16} />
                    </ActionButton>
                    <DeleteButton title="Delete release" onClick={(e) => handleDelete(e, release.id)}>
                      <Trash2 size={16} />
                    </DeleteButton>
                  </ActionButtonGroup>
                </AlbumItemHeader>
                {release.status === 'rejected' && release.rejection_reason && (
                  <RejectionReasonContainer>
                    <Info size={18} />
                    <RejectionReasonText>
                      **Reason for Rejection:** {release.rejection_reason}
                    </RejectionReasonText>
                  </RejectionReasonContainer>
                )}
                {expandedAlbums[release.id] && (
                  <TrackSubList>
                    {release.tracks.length > 0 ? release.tracks.map(track => (
                      <TrackItem key={track.id}>
                        <Music size={14} />
                        <span>{track.title}</span>
                      </TrackItem>
                    )) : <TrackItem>No tracks in this album.</TrackItem>}
                  </TrackSubList>
                )}
              </AlbumItem>
            )) : <p>You have not uploaded any releases yet.</p>}
          </ReleaseListContainer>
        </section>
      </Container>
    </>
  );
};

export default DashboardPage;
