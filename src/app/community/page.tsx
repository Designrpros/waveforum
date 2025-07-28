"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import Link from 'next/link';
import {
  MessageSquare, Users, BookOpen, Handshake, Megaphone,
  Mic, Lightbulb, TrendingUp, FolderOpen, FileText, // Removed Sparkles
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

const HeroSection = styled(Section)`
  text-align: center;
  padding-top: 6rem;
  padding-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.text};
  @media (min-width: 640px) {
    font-size: 4.5rem;
  }
`;

const GradientText = styled.span`
  background-image: ${({ theme }) => theme.accentGradient};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroSubtitle = styled.p`
  margin-top: 1.5rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.subtleText};
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 1rem;
  @media (min-width: 640px) {
    font-size: 3rem;
  }
`;

const SectionSubtitleSmall = styled.p`
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CardText = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.5;
`;

const CardLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ForumCategoryGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const ForumCategoryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
`;

const ForumIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  margin-bottom: 1rem;
`;

const NewsItem = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const NewsTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const NewsDate = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.subtleText};
  margin-bottom: 0.5rem;
`;

const ArtistSpotlightCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ArtistAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 2px solid ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
`;

const ArtistName = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const ArtistGenre = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.subtleText};
`;

const CollaborationPostCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const CollaborationTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const CollaborationTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.subtleText};
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const ResourceCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;


const CommunityPage: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Community - WaveForum Artist Portal</title>
        <meta name="description" content="Connect with other artists, share insights, and collaborate on the WaveForum community." />
      </Head>
      <Container>
        <HeroSection>
          <HeroTitle>
            Join the <GradientText>WaveForum Community.</GradientText>
          </HeroTitle>
          <HeroSubtitle>
            Connect with fellow artists, share your journey, get feedback, and find collaborators to elevate your sound.
          </HeroSubtitle>
        </HeroSection>

        {/* Forum Section */}
        <Section>
          <SectionTitle>Discussion Forums</SectionTitle>
          <SectionSubtitleSmall>
            Dive into conversations on music production, marketing, licensing, and more.
          </SectionSubtitleSmall>
          <ForumCategoryGrid>
            <ForumCategoryCard>
              <ForumIconWrapper><MessageSquare size={24} /></ForumIconWrapper>
              <CardTitle>General Discussion</CardTitle>
              <CardText>Talk about anything and everything related to being an independent artist.</CardText>
              <CardLink href="#">View Forum</CardLink>
            </ForumCategoryCard>
            <ForumCategoryCard>
              <ForumIconWrapper><Mic size={24} /></ForumIconWrapper>
              <CardTitle>Production &amp; Gear</CardTitle>
              <CardText>Share tips, ask questions about DAWs, plugins, and recording equipment.</CardText>
              <CardLink href="#">View Forum</CardLink>
            </ForumCategoryCard>
            <ForumCategoryCard>
              <ForumIconWrapper><TrendingUp size={24} /></ForumIconWrapper>
              <CardTitle>Marketing &amp; Promotion</CardTitle>
              <CardText>Strategies for getting your music heard, social media, and building your fanbase.</CardText>
              <CardLink href="#">View Forum</CardLink>
            </ForumCategoryCard>
            <ForumCategoryCard>
              <ForumIconWrapper><FileText size={24} /></ForumIconWrapper>
              <CardTitle>Licensing &amp; Rights</CardTitle>
              <CardText>Discuss Creative Commons, copyright, and protecting your intellectual property.</CardText>
              <CardLink href="#">View Forum</CardLink>
            </ForumCategoryCard>
            <ForumCategoryCard>
              <ForumIconWrapper><Lightbulb size={24} /></ForumIconWrapper>
              <CardTitle>Feedback &amp; Critiques</CardTitle>
              <CardText>Get constructive feedback on your tracks from other artists.</CardText>
              <CardLink href="#">View Forum</CardLink>
            </ForumCategoryCard>
            <ForumCategoryCard>
              <ForumIconWrapper><Users size={24} /></ForumIconWrapper>
              <CardTitle>Community Events</CardTitle>
              <CardText>Find out about virtual meetups, workshops, and challenges.</CardText>
              <CardLink href="#">View Forum</CardLink>
            </ForumCategoryCard>
          </ForumCategoryGrid>
        </Section>

        {/* Announcements Section */}
        <Section>
          <SectionTitle>WaveForum Announcements</SectionTitle>
          <SectionSubtitleSmall>
            Stay up-to-date with the latest news, features, and updates from our team.
          </SectionSubtitleSmall>
          <Grid style={{ gridTemplateColumns: '1fr' }}>
            <NewsItem>
              <NewsTitle>New Feature: Royalty Splits Beta!</NewsTitle>
              <NewsDate>July 25, 2025</NewsDate>
              <CardText>We&apos;re excited to announce the beta launch of our new royalty splits feature. You can now easily set up automatic payments to your collaborators directly from your dashboard.</CardText>
              <CardLink href="#">Read More</CardLink>
            </NewsItem>
            <NewsItem>
              <NewsTitle>Upcoming Maintenance Window</NewsTitle>
              <NewsDate>July 20, 2025</NewsDate>
              <CardText>Scheduled maintenance on August 1st from 2 AM - 4 AM UTC to improve platform performance. Expect brief downtime.</CardText>
              <CardLink href="#">Read More</CardLink>
            </NewsItem>
            <NewsItem>
              <NewsTitle>WaveForum Hits 10,000 Artists!</NewsTitle>
              <NewsDate>July 15, 2025</NewsDate>
              <CardText>A huge thank you to our growing community! We&apos;re thrilled to see so many independent artists thriving with WaveForum.</CardText>
              <CardLink href="#">Read More</CardLink>
            </NewsItem>
          </Grid>
        </Section>

        {/* Artist Spotlight Section */}
        <Section>
          <SectionTitle>Artist Spotlight</SectionTitle>
          <SectionSubtitleSmall>
            Discover and get inspired by featured artists from the WaveForum community.
          </SectionSubtitleSmall>
          <Grid>
            <ArtistSpotlightCard>
              <ArtistAvatar src="https://placehold.co/80x80/007bff/FFFFFF?text=A1" alt="Artist 1" />
              <ArtistName>Echo Bloom</ArtistName>
              <ArtistGenre>Electronic / Ambient</ArtistGenre>
              <CardText>Known for their ethereal soundscapes and intricate beats, Echo Bloom is pushing the boundaries of electronic music.</CardText>
              <CardLink href="#">View Profile</CardLink>
            </ArtistSpotlightCard>
            <ArtistSpotlightCard>
              <ArtistAvatar src="https://placehold.co/80x80/0056b3/FFFFFF?text=A2" alt="Artist 2" />
              <ArtistName>Rhythm Weaver</ArtistName>
              <ArtistGenre>Hip-Hop / Soul</ArtistGenre>
              <CardText>A master of lyrical storytelling, Rhythm Weaver blends classic hip-hop vibes with modern soulful melodies.</CardText>
              <CardLink href="#">View Profile</CardLink>
            </ArtistSpotlightCard>
            <ArtistSpotlightCard>
              <ArtistAvatar src="https://placehold.co/80x80/4a90d9/FFFFFF?text=A3" alt="Artist 3" />
              <ArtistName>Luna Sol</ArtistName>
              <ArtistGenre>Folk / Acoustic</ArtistGenre>
              <CardText>Luna Sol&apos;s heartfelt lyrics and captivating acoustic arrangements create an intimate listening experience.</CardText>
              <CardLink href="#">View Profile</CardLink>
            </ArtistSpotlightCard>
          </Grid>
        </Section>

        {/* Collaboration Board Section */}
        <Section>
          <SectionTitle>Collaboration Board</SectionTitle>
          <SectionSubtitleSmall>
            Find the perfect partner for your next project or offer your skills to others.
          </SectionSubtitleSmall>
          <Grid>
            <CollaborationPostCard>
              <CardTitle><Handshake size={20} /> Looking for a Vocalist</CardTitle>
              <CardText>Electronic producer seeking a female vocalist for a new ambient-pop track. Must have experience with melodic hooks.</CardText>
              <CollaborationTags>
                <Tag>Electronic</Tag>
                <Tag>Vocalist</Tag>
                <Tag>Remote</Tag>
              </CollaborationTags>
              <CardLink href="#">View Post</CardLink>
            </CollaborationPostCard>
            <CollaborationPostCard>
              <CardTitle><Handshake size={20} /> Mixing Engineer Available</CardTitle>
              <CardText>Experienced mixing engineer offering services for indie artists. Specializing in rock, pop, and alternative genres.</CardText>
              <CollaborationTags>
                <Tag>Mixing</Tag>
                <Tag>Engineer</Tag>
                <Tag>Rock</Tag>
              </CollaborationTags>
              <CardLink href="#">View Post</CardLink>
            </CollaborationPostCard>
            <CollaborationPostCard>
              <CardTitle><Handshake size={20} /> Beatmaker for Hip-Hop</CardTitle>
              <CardText>Rapper looking for a versatile beatmaker for a new album. Open to various hip-hop subgenres.</CardText>
              <CollaborationTags>
                <Tag>Hip-Hop</Tag>
                <Tag>Beatmaker</Tag>
                <Tag>Producer</Tag>
              </CollaborationTags>
              <CardLink href="#">View Post</CardLink>
            </CollaborationPostCard>
          </Grid>
        </Section>

        {/* Resources Section */}
        <Section>
          <SectionTitle>Resources &amp; Knowledge Base</SectionTitle>
          <SectionSubtitleSmall>
            Access guides, tutorials, and FAQs to help you navigate your music career.
          </SectionSubtitleSmall>
          <Grid>
            <ResourceCard>
              <CardTitle><BookOpen size={20} /> Getting Started with Distribution</CardTitle>
              <CardText>A step-by-step guide to uploading your first track on WaveForum.</CardText>
              <CardLink href="#">Read Guide</CardLink>
            </ResourceCard>
            <ResourceCard>
              <CardTitle><FolderOpen size={20} /> Understanding Music Licensing</CardTitle>
              <CardText>Learn about Creative Commons vs. proprietary licenses and which is right for you.</CardText>
              <CardLink href="#">Read Article</CardLink>
            </ResourceCard>
            <ResourceCard>
              <CardTitle><Megaphone size={20} /> Promoting Your Music Effectively</CardTitle>
              <CardText>Tips and tricks for marketing your releases and growing your audience online.</CardText>
              <CardLink href="#">Read Tips</CardLink>
            </ResourceCard>
          </Grid>
        </Section>
      </Container>
    </>
  );
};

export default CommunityPage