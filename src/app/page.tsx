"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import { UploadCloud, Users, DollarSign, Award, MessageSquare, BarChart2 } from 'lucide-react'; // Icons for WaveForum features
import { useTheme } from 'styled-components'; // Import useTheme hook

// --- Reused & Adapted Styled Components from main pages for consistency ---
const Section = styled.section`
  padding-top: 6rem;
  padding-bottom: 6rem;
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
  padding-top: 8rem;
  padding-bottom: 8rem;
`;

const HeroContent = styled.div`
  margin: 0 auto;
  max-width: 60rem;
  position: relative;
  z-index: 10;
`;

const HeroBackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  /* Now using accentGradient for the glow, taking the start color */
  background: radial-gradient(circle, ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]}, transparent 70%);
  transform: translate(-50%, -50%);
  filter: blur(120px);
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text};
  @media (min-width: 640px) {
    font-size: 5.5rem;
  }
`;

const GradientText = styled.span`
  /* Changed to use accentGradient for text gradient effect */
  background-image: ${({ theme }) => theme.accentGradient};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroSubtitle = styled.p`
  margin-top: 1.5rem;
  font-size: 1.375rem;
  color: ${({ theme }) => theme.subtleText};
  @media (min-width: 640px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const StyledButton = styled(Link)` /* Changed to Link for internal navigation */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 0.75rem 1.25rem;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.2s;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

const PrimaryButton = styled(StyledButton)`
  /* Now using accentGradient for background */
  background: ${({ theme }) => theme.accentGradient};
  color: ${({ theme }) => theme.primaryButtonTextColor}; /* Updated to use new theme variable */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: ${({ theme }) => theme.accentGradient}; /* Keep consistent hover color */
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 1rem;
  @media (min-width: 640px) {
    font-size: 3.5rem;
  }
`;

const SectionSubtitle = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 4rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StyledFeatureCard = styled.div`
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
  text-align: center;
`;

const FeatureIconWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  /* Now using accentGradient for background */
  background: ${({ theme }) => theme.accentGradient};
  color: white;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.6;
`;

const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const StepCard = styled(StyledFeatureCard)`
  text-align: left;
  padding: 1.5rem;
`;

const StepNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  /* Now using accentGradient's start color for the number */
  color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
  margin-bottom: 0.5rem;
`;

const StepTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.subtleText};
  line-height: 1.5;
`;


// --- Helper Components ---
const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <StyledFeatureCard>
    <FeatureIconWrapper>{icon}</FeatureIconWrapper>
    <FeatureTitle>{title}</FeatureTitle>
    <FeatureText>{children}</FeatureText>
  </StyledFeatureCard>
);


const WaveForumPage: NextPage = () => {
  const theme = useTheme(); // Use the useTheme hook to access theme properties

  return (
    <>
      <Head>
        <title>WaveForum - Artist Portal | Waveform.ink</title>
        <meta name="description" content="WaveForum is the artist portal for Waveform.ink. Upload, license, and distribute your music directly to a passionate audience." />
      </Head>
      <Container>
        <HeroSection>
          <HeroBackgroundGlow />
          <HeroContent>
            <HeroTitle>
              Your Music,
              <br />
              <GradientText>Your Platform.</GradientText>
            </HeroTitle>
            <HeroSubtitle>
              WaveForum empowers independent artists with direct distribution, flexible licensing, and full control over their sound.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton href="#">Join WaveForum</PrimaryButton> {/* Placeholder for registration link */}
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        <Section>
          <SectionTitle>Why Distribute with WaveForum?</SectionTitle>
          <SectionSubtitle>
            We offer unique advantages designed to help independent artists thrive in the digital music landscape.
          </SectionSubtitle>
          <FeatureGrid>
            <FeatureCard icon={<UploadCloud size={32} />} title="Direct Upload &amp; Hosting">
              Bypass traditional gatekeepers. Upload your tracks directly to our secure platform for seamless distribution to Waveform app users.
            </FeatureCard>
            <FeatureCard icon={<Award size={32} />} title="Flexible Licensing Options">
              Choose between Creative Commons for maximum reach and collaboration, or proprietary licenses for exclusive control within our ecosystem.
            </FeatureCard>
            <FeatureCard icon={<Users size={32} />} title="Dedicated Audience">
              Connect with listeners who actively seek out independent and diverse music. Build a loyal fanbase without getting lost in the noise.
            </FeatureCard>
            <FeatureCard icon={<DollarSign size={32} />} title="Fairer Monetization (Coming Soon)">
              We&apos;re building transparent and artist-friendly monetization models to ensure you get fairly compensated for your work.
            </FeatureCard>
            <FeatureCard icon={<BarChart2 size={32} />} title="Performance Insights (Coming Soon)">
              Gain valuable data on how your music is performing, where it&apos;s being heard, and who&apos;s listening.
            </FeatureCard>
            <FeatureCard icon={<MessageSquare size={32} />} title="Direct Fan Engagement">
              (Coming Soon) Tools to interact directly with your listeners, foster community, and gather feedback.
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section>
          <SectionTitle>How It Works: Get Your Music Heard</SectionTitle>
          <SectionSubtitle>
            Our streamlined process makes it easy to upload, license, and publish your tracks.
          </SectionSubtitle>
          <HowItWorksGrid>
            <StepCard>
              <StepNumber>01</StepNumber>
              <StepTitle>Create Your Free Account</StepTitle>
              <StepDescription>
                Sign up for your WaveForum artist account. It&apos;s quick, easy, and your gateway to our music ecosystem.
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>02</StepNumber>
              <StepTitle>Upload Your Tracks &amp; Art</StepTitle>
              <StepDescription>
                Upload your high-quality audio files, album art, and provide all necessary metadata (titles, genres, artist info).
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>03</StepNumber>
              <StepTitle>Choose Your License</StepTitle>
              <StepDescription>
                Select the appropriate Creative Commons or proprietary license for each track. We guide you through the options.
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>04</StepNumber>
              <StepTitle>Review &amp; Publish</StepTitle>
              <StepDescription>
                Review your submission. Once approved by our curation team, your music will be live in the Waveform app.
              </StepDescription>
            </StepCard>
          </HowItWorksGrid>
        </Section>

        <Section style={{ textAlign: 'center' }}>
          <SectionTitle>Ready to Take Control of Your Music?</SectionTitle>
          <SectionSubtitle>
            Join WaveForum today and start sharing your sound with the world.
          </SectionSubtitle>
          <ButtonGroup style={{ marginTop: '2rem' }}>
            <PrimaryButton href="#">Start Uploading</PrimaryButton> {/* Placeholder for actual upload/registration link */}
          </ButtonGroup>
        </Section>
      </Container>
    </>
  );
};

export default WaveForumPage;