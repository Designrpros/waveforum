// src/app/upload/page.tsx
"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useCallback, ChangeEvent, useEffect, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud, Music, Image as ImageIcon,
  Info, CheckCircle, XCircle, Loader, PlusCircle, Trash2, X
} from 'lucide-react';
import { genreList } from '../../data/genres';

// --- (Styled Components are unchanged) ---
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
const SectionSubtitle = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.subtleText};
  text-align: center;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
`;
const UploadForm = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;
const FormSectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  padding-bottom: 0.5rem;
`;
const FormGroup = styled.div`
  margin-bottom: 1rem;
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
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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
const FileDropArea = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${({ theme, $isDragActive }) => $isDragActive ? theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0] : theme.borderColor};
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  background-color: ${({ theme, $isDragActive }) => $isDragActive ? theme.buttonHoverBg : theme.buttonBg};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;
const FileInput = styled.input`
  display: none;
`;
const UploadIconWrapper = styled.div`
  color: ${({ theme }) => theme.subtleText};
`;
const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.accentGradient};
  color: ${({ theme }) => theme.primaryButtonTextColor};
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const MessageContainer = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const SuccessMessage = styled(MessageContainer)`
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
`;
const ErrorMessage = styled(MessageContainer)`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
`;
const InfoMessage = styled(MessageContainer)`
  background-color: #cfe2ff;
  color: #055160;
  border: 1px solid #b6d4fe;
`;
const ArtworkPreview = styled.img`
  max-width: 150px;
  max-height: 150px;
  border-radius: 0.5rem;
  object-fit: cover;
  margin-top: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;
const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  input[type="radio"] {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid ${({ theme }) => theme.borderColor};
    border-radius: 50%;
    display: grid;
    place-content: center;
    transition: all 0.2s ease;
    &::before {
      content: "";
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.2s ease;
      background-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
    }
    &:checked {
      border-color: ${({ theme }) => theme.accentGradient.replace('linear-gradient(to right, ', '').split(', ')[0]};
      &::before {
        transform: scale(1);
      }
    }
  }
`;
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;
const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
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
const AddTrackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;
const RemoveTrackButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
  }
`;
const InfoText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtleText};
  margin-top: 0.5rem;
`;
const GenreInputWrapper = styled.div`
  position: relative;
`;
const GenreTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  min-height: 40px;
`;
const GenreTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.9rem;
`;
const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;
const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  position: absolute;
  width: 100%;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
`;
const SuggestionItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBg};
  }
`;

interface Track {
  id: string; 
  title: string;
  file: File | null;
}

const UploadPage: NextPage = () => {
  const theme = useTheme();
  const router = useRouter(); 
  const { user, loading } = useAuth();

  const [isDragActive, setIsDragActive] = useState(false);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreviewUrl, setArtworkPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [releaseType, setReleaseType] = useState<'single' | 'album'>('single');
  const [releaseArtistName, setReleaseArtistName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [licensing, setLicensing] = useState<'cc' | 'proprietary'>('proprietary');
  const [ccType, setCcType] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([{ id: 'track-1', title: '', file: null }]);
  const [trackCounter, setTrackCounter] = useState(1);

  const allGenres = useMemo(() => genreList.flatMap(group => group.options), []);
  
  const [artistProfile, setArtistProfile] = useState<{ profile: { display_name: string }, artist: { artist_name: string } | null } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (response.ok) {
          const data = await response.json();
          setArtistProfile(data);
          setReleaseArtistName(data.artist?.artist_name || data.profile?.display_name || '');
        }
      } catch (error) {
        console.error("Could not fetch artist profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, loading, router]);


  useEffect(() => {
    if (genreInput) {
      const filtered = allGenres.filter(
        g => g.toLowerCase().includes(genreInput.toLowerCase()) && !genres.includes(g)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [genreInput, genres, allGenres]);

  const handleAddGenre = (genre: string) => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
      setGenreInput('');
      setSuggestions([]);
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setGenres(genres.filter(g => g !== genreToRemove));
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetType: 'artwork' | 'track', trackId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (targetType === 'artwork') {
        const image = Array.from(files).find(f => f.type.startsWith('image/'));
        if (image) handleArtworkFile(image);
      } else if (targetType === 'track' && trackId) {
        const audio = Array.from(files).find(f => f.type.startsWith('audio/'));
        if (audio) handleTrackFile(trackId, audio);
      }
    }
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, targetType: 'artwork' | 'track', trackId?: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (targetType === 'track' && trackId) {
        handleTrackFile(trackId, files[0]);
      } else if (targetType === 'artwork') {
        handleArtworkFile(files[0]);
      }
    }
  };

  const handleArtworkFile = (file: File) => {
    setArtworkFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setArtworkPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTrackFile = (trackId: string, file: File) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, file: file } : track
      )
    );
  };

  const handleTrackTitleChange = (trackId: string, title: string) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, title: title } : track
      )
    );
  };

  const addTrack = () => {
    setTrackCounter(prev => prev + 1);
    setTracks(prevTracks => [...prevTracks, { id: `track-${trackCounter + 1}`, title: '', file: null }]);
  };

  const removeTrack = (trackId: string) => {
    setTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('loading');
    setMessage(null);

    // --- Start Enhanced Debugging ---
    console.log("DEBUG: handleSubmit triggered.");

    if (!artworkFile || tracks.some(t => !t.file || !t.title) || genres.length === 0) {
      const debugMessage = `Validation failed: artworkFile=${!!artworkFile}, tracks valid=${!tracks.some(t => !t.file || !t.title)}, genres count=${genres.length}`;
      console.error("DEBUG:", debugMessage);
      setMessage('Please ensure artwork, all track files, titles, and at least one genre are provided.');
      setUploadStatus('error');
      return;
    }

    if (!user) {
      console.error("DEBUG: User is not authenticated.");
      setMessage('You must be logged in to upload music.');
      setUploadStatus('error');
      return;
    }

    const idToken = await user.getIdToken();
    const formData = new FormData();
    
    formData.append('artwork', artworkFile);
    tracks.forEach((track, index) => {
      if (track.file) {
        formData.append('tracks', track.file);
        console.log(`DEBUG: Appending track #${index + 1}:`, track.file.name);
      }
    });

    formData.append('releaseArtistName', releaseArtistName);
    formData.append('releaseType', releaseType);
    if (releaseType === 'album') {
      formData.append('albumName', albumName);
    }
    formData.append('genres', genres.join(', '));
    formData.append('releaseDate', releaseDate);
    formData.append('description', description);
    formData.append('licensing', licensing);
    if (ccType) formData.append('ccType', ccType);
    
    const trackTitles = tracks.map(t => t.title);
    formData.append('trackTitles', JSON.stringify(trackTitles));
    
    console.log("DEBUG: FormData prepared. Sending request to backend...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, { 
          method: 'POST',
          body: formData,
          headers: {
              'Authorization': `Bearer ${idToken}`
          }
      });

      // --- This is the key debugging addition ---
      console.log(`DEBUG: Backend responded with status: ${response.status}`);
      if (!response.ok) {
        // We get the raw text of the response to see the actual server error
        const errorText = await response.text();
        console.error("DEBUG: Backend error response body:", errorText);
        // Try to parse it as JSON, but fall back to the raw text if it fails
        try {
            const result = JSON.parse(errorText);
            throw new Error(result.message || 'Upload failed due to a server error.');
        } catch (jsonError) {
            throw new Error(errorText || 'Upload failed due to an unknown server error.');
        }
      }
      
      const result = await response.json();
      console.log("DEBUG: Backend success response:", result);
      setUploadStatus('success');
      setMessage(result.message);
      
      // Reset form on success
      setReleaseType('single');
      setReleaseArtistName(artistProfile?.artist?.artist_name || artistProfile?.profile?.display_name || '');
      setAlbumName('');
      setGenres([]);
      setReleaseDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setArtworkFile(null);
      setArtworkPreviewUrl(null);
      setLicensing('proprietary');
      setCcType(null);
      setTracks([{ id: 'track-1', title: '', file: null }]);
      setTrackCounter(1);

    } catch (error: unknown) {
      console.error('DEBUG: Caught an error during fetch/upload process:', error);
      setUploadStatus('error');
      if (error instanceof Error) {
        setMessage(error.message || 'Failed to upload music. Please try again.');
      } else {
        setMessage('An unknown error occurred while uploading. Please try again.');
      }
    }
  };

  if (loading || profileLoading) {
      return (
        <Container><SectionTitle>Loading...</SectionTitle></Container>
      );
  }

  if (!user) {
    return null; // The useEffect will handle redirection to login
  }

  return (
    <>
      <Head>
        <title>Upload Music - WaveForum Artist Portal</title>
        <meta name="description" content="Upload your music to WaveForum for distribution." />
      </Head>
      <Container>
        <Section>
          <SectionTitle>Upload Your Music</SectionTitle>
          <SectionSubtitle>
            Get your tracks heard by a global audience. Fill in the details and upload your masterpiece.
          </SectionSubtitle>

          <UploadForm onSubmit={handleSubmit} noValidate>
            <FormSectionTitle>Release Type</FormSectionTitle>
            <FormGroup>
              <RadioGroup>
                <RadioOption>
                  <input type="radio" name="release-type" value="single" checked={releaseType === 'single'} onChange={() => { setReleaseType('single'); setTracks([{ id: 'track-1', title: '', file: null }]); setTrackCounter(1); }} />
                  Single (One track release)
                </RadioOption>
                <RadioOption>
                  <input type="radio" name="release-type" value="album" checked={releaseType === 'album'} onChange={() => setReleaseType('album')} />
                  Album / EP (Multiple tracks)
                </RadioOption>
              </RadioGroup>
            </FormGroup>

            <FormSectionTitle>General Release Details</FormSectionTitle>
            <FormGroup>
              <Label htmlFor="release-artist-name">Artist Name(s)</Label>
              <Input
                type="text"
                id="release-artist-name"
                value={releaseArtistName}
                onChange={(e) => setReleaseArtistName(e.target.value)}
                placeholder="e.g., Aurora Bloom"
                required
                disabled={!!artistProfile?.artist}
              />
              {artistProfile?.artist && <InfoText>Your artist name is already set in your profile and cannot be changed here.</InfoText>}
            </FormGroup>
            {releaseType === 'album' && (
              <FormGroup>
                <Label htmlFor="album-name">Album Name</Label>
                <Input type="text" id="album-name" value={albumName} onChange={(e) => setAlbumName(e.target.value)} placeholder="e.g., Celestial Harmonies" required={releaseType === 'album'} />
              </FormGroup>
            )}
            
            <FormGroup>
              <Label htmlFor="genres">Genres</Label>
              <GenreInputWrapper>
                <Input
                  type="text"
                  id="genres"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && suggestions.length > 0) {
                      e.preventDefault();
                      handleAddGenre(suggestions[0]);
                    }
                  }}
                  placeholder="Type to search for genres..."
                />
                {suggestions.length > 0 && (
                  <SuggestionsList>
                    {suggestions.map(s => (
                      <SuggestionItem key={s} onClick={() => handleAddGenre(s)}>
                        {s}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </GenreInputWrapper>
              <GenreTagContainer>
                {genres.map(g => (
                  <GenreTag key={g}>
                    {g}
                    <RemoveTagButton type="button" onClick={() => handleRemoveGenre(g)}>
                      <X size={14} />
                    </RemoveTagButton>
                  </GenreTag>
                ))}
              </GenreTagContainer>
              <InfoText>Select one or more genres for your release.</InfoText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="release-date">Release Date</Label>
              <Input type="date" id="release-date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" value={description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Tell us more about your release..." />
            </FormGroup>

            <FormSectionTitle>Album Artwork</FormSectionTitle>
            <FormGroup>
              <Label htmlFor="artwork-file">Artwork (JPG, PNG - Min. 1000x1000px)</Label>
              <FileDropArea $isDragActive={isDragActive} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'artwork')} onClick={() => document.getElementById('artwork-file')?.click()}>
                <FileInput type="file" id="artwork-file" accept="image/jpeg, image/png" onChange={(e) => handleFileSelect(e, 'artwork')} />
                <UploadIconWrapper><ImageIcon size={48} /></UploadIconWrapper>
                <p>Drag &amp; drop your artwork here, or click to browse</p>
                {artworkFile && <p style={{ color: theme.text }}>Selected: {artworkFile.name}</p>}
                {artworkPreviewUrl && <ArtworkPreview src={artworkPreviewUrl} alt="Artwork Preview" />}
              </FileDropArea>
            </FormGroup>

            <FormSectionTitle>{releaseType === 'single' ? 'Track Details' : 'Tracks'}</FormSectionTitle>
            {tracks.map((track, index) => (
              <React.Fragment key={track.id}>
                {releaseType === 'album' && <h4 style={{ color: theme.text, marginBottom: '0.5rem', marginTop: index > 0 ? '1.5rem' : '0' }}>Track {index + 1}</h4>}
                <FormGroup>
                  <Label htmlFor={`track-title-${track.id}`}>Track Title</Label>
                  <Input type="text" id={`track-title-${track.id}`} value={track.title} onChange={(e) => handleTrackTitleChange(track.id, e.target.value)} placeholder={`e.g., Track ${index + 1} Title`} required />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor={`audio-file-${track.id}`}>Audio File (MP3, WAV, FLAC)</Label>
                  <FileDropArea $isDragActive={isDragActive} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'track', track.id)} onClick={() => document.getElementById(`audio-file-${track.id}`)?.click()}>
                    <FileInput type="file" id={`audio-file-${track.id}`} accept="audio/mpeg, audio/wav, audio/flac" onChange={(e) => handleFileSelect(e, 'track', track.id)} />
                    <UploadIconWrapper><Music size={48} /></UploadIconWrapper>
                    <p>Drag &amp; drop audio for &quot;{track.title || `Track ${index + 1}`}&quot; here, or click to browse</p>
                    {track.file && <p style={{ color: theme.text }}>Selected: {track.file.name}</p>}
                  </FileDropArea>
                </FormGroup>
                {releaseType === 'album' && tracks.length > 1 && (
                  <RemoveTrackButton type="button" onClick={() => removeTrack(track.id)}>
                    <Trash2 size={20} /> Remove Track
                  </RemoveTrackButton>
                )}
              </React.Fragment>
            ))}
            {releaseType === 'album' && (
              <AddTrackButton type="button" onClick={addTrack}>
                <PlusCircle size={20} /> Add Another Track
              </AddTrackButton>
            )}

            <FormSectionTitle>Licensing</FormSectionTitle>
            <FormGroup>
              <Label>Choose your licensing option:</Label>
              <RadioGroup>
                <RadioOption>
                  <input type="radio" name="licensing" value="proprietary" checked={licensing === 'proprietary'} onChange={() => { setLicensing('proprietary'); setCcType(null); }} />
                  Proprietary (Exclusive to Waveform.ink)
                </RadioOption>
                <RadioOption>
                  <input type="radio" name="licensing" value="cc" checked={licensing === 'cc'} onChange={() => setLicensing('cc')} />
                  Creative Commons (Commercial use allowed)
                </RadioOption>
              </RadioGroup>
            </FormGroup>
            {licensing === 'cc' && (
              <FormGroup>
                <Label>Creative Commons Type:</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input type="checkbox" value="BY" checked={ccType === 'BY'} onChange={() => setCcType(ccType === 'BY' ? null : 'BY')} />
                    Attribution (BY)
                  </CheckboxOption>
                   <CheckboxOption>
                    <input type="checkbox" value="BY-SA" checked={ccType === 'BY-SA'} onChange={() => setCcType(ccType === 'BY-SA' ? null : 'BY-SA')} />
                    Attribution-ShareAlike (BY-SA)
                  </CheckboxOption>
                </CheckboxGroup>
                {!ccType && <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.5rem' }}>Please select a Creative Commons type.</p>}
              </FormGroup>
            )}
            
            <UploadButton type="submit" disabled={uploadStatus === 'loading'}>
              {uploadStatus === 'loading' ? (
                <>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={20} /> Submit for Review
                </>
              )}
            </UploadButton>

            {uploadStatus === 'success' && message && (
              <SuccessMessage>
                <CheckCircle size={20} /> {message}
              </SuccessMessage>
            )}
            {uploadStatus === 'error' && message && (
              <ErrorMessage>
                <XCircle size={20} /> {message}
              </ErrorMessage>
            )}
            {uploadStatus === 'idle' && message && (
              <InfoMessage>
                <Info size={20} /> {message}
              </InfoMessage>
            )}
          </UploadForm>
        </Section>
      </Container>
    </>
  );
};

export default UploadPage;