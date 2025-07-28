"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useCallback, ChangeEvent } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  UploadCloud, Music, Image as ImageIcon,
  Info, CheckCircle, XCircle, Loader, PlusCircle, Trash2,
} from 'lucide-react'; // Removed unused imports: FileText, Award, Percent

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

// --- New Styled Components for Upload Form ---

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
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  appearance: none; /* Remove default arrow */
  background-image: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E&#34;);
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5em 1.5em;
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
      content: "&#10003;"; /* Unicode checkmark */
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

const TrackListItem = styled.div`
  background-color: ${({ theme }) => theme.buttonBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;

  p {
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
    flex-grow: 1;
  }
`;

const RemoveTrackButton = styled.button`
  background: none;
  border: none;
  color: #dc3545; /* Red for delete */
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

// Define a type for a single track
interface Track {
  id: string; // Unique ID for React keys
  title: string;
  file: File | null;
}

const UploadPage: NextPage = () => {
  const theme = useTheme();
  const [isDragActive, setIsDragActive] = useState(false);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreviewUrl, setArtworkPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  // Release type: 'single' or 'album'
  const [releaseType, setReleaseType] = useState<'single' | 'album'>('single');

  // Album/Release level metadata
  const [releaseArtistName, setReleaseArtistName] = useState('');
  const [albumName, setAlbumName] = useState(''); // Only relevant for albums
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');

  // Licensing state
  const [licensing, setLicensing] = useState<'cc' | 'proprietary'>('proprietary');
  const [ccType, setCcType] = useState<string | null>(null); // e.g., 'BY', 'BY-SA', 'BY-NC'

  // Tracks state for albums (array of objects)
  const [tracks, setTracks] = useState<Track[]>([{ id: 'track-1', title: '', file: null }]);
  const [trackCounter, setTrackCounter] = useState(1); // To generate unique IDs for new tracks

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
  }, []); // Removed 'tracks' from dependency array

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, targetType: 'artwork' | 'track', trackId?: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (targetType === 'track' && trackId) { // Corrected 'type' to 'targetType' and added trackId check
        handleTrackFile(trackId, files[0]);
      } else if (targetType === 'artwork') { // Corrected 'type' to 'targetType'
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

    // Basic validation
    let isValid = true;
    if (!releaseArtistName || !genre || !releaseDate || !artworkFile) {
      setMessage('Please fill all required release details and upload artwork.');
      isValid = false;
    }

    if (releaseType === 'single') {
      if (!tracks[0].file || !tracks[0].title) {
        setMessage('Please upload the audio file and provide a title for your single.');
        isValid = false;
      }
    } else { // Album
      if (!albumName) {
        setMessage('Please provide an album name.');
        isValid = false;
      }
      if (tracks.length === 0) {
        setMessage('Please add at least one track to your album.');
        isValid = false;
      }
      for (const track of tracks) {
        if (!track.file || !track.title) {
          setMessage(`Please upload audio and provide a title for all tracks. Missing: ${track.title || 'Untitled Track'}`);
          isValid = false;
          break;
        }
      }
    }

    if (licensing === 'cc' && !ccType) {
      setMessage('Please select a Creative Commons type.');
      isValid = false;
    }

    if (!isValid) {
      setUploadStatus('error');
      return;
    }

    // Simulate API call
    console.log('Uploading Release:', {
      releaseType,
      releaseArtistName,
      albumName: releaseType === 'album' ? albumName : undefined,
      genre,
      releaseDate,
      description,
      artworkFile: artworkFile?.name,
      licensing,
      ccType: licensing === 'cc' ? ccType : undefined,
      tracks: tracks.map(t => ({ id: t.id, title: t.title, fileName: t.file?.name })),
    });

    try {
      // In a real application, you'd send these files and metadata to your backend API
      // Example:
      // const formData = new FormData();
      // formData.append('artwork', artworkFile);
      // tracks.forEach((track, index) => {
      //   if (track.file) formData.append(`track-${index}`, track.file);
      //   formData.append(`track-${index}-title`, track.title);
      // });
      // formData.append('releaseType', releaseType);
      // ... and so on for other metadata
      //
      // const response = await fetch('/api/upload-release', {
      //   method: 'POST',
      //   body: formData,
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Upload failed');
      // }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      setUploadStatus('success');
      setMessage('Release uploaded successfully! It will be reviewed by our team.');
      // Reset form
      setReleaseType('single');
      setReleaseArtistName('');
      setAlbumName('');
      setGenre('');
      setReleaseDate('');
      setDescription('');
      setArtworkFile(null);
      setArtworkPreviewUrl(null);
      setLicensing('proprietary');
      setCcType(null);
      setTracks([{ id: 'track-1', title: '', file: null }]);
      setTrackCounter(1);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setMessage('Failed to upload music. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Upload Music - WaveForum Artist Portal</title>
        <meta name="description" content="Upload your music to WaveForum for distribution to the Waveform app and other platforms." />
      </Head>
      <Container>
        <Section>
          <SectionTitle>Upload Your Music</SectionTitle>
          <SectionSubtitle>
            Get your tracks heard by a global audience. Fill in the details and upload your masterpiece.
          </SectionSubtitle>

          <UploadForm onSubmit={handleSubmit}>
            {/* Release Type Selection */}
            <FormSectionTitle>Release Type</FormSectionTitle>
            <FormGroup>
              <RadioGroup>
                <RadioOption>
                  <input
                    type="radio"
                    name="release-type"
                    value="single"
                    checked={releaseType === 'single'}
                    onChange={() => setReleaseType('single')}
                  />
                  Single (One track release)
                </RadioOption>
                <RadioOption>
                  <input
                    type="radio"
                    name="release-type"
                    value="album"
                    checked={releaseType === 'album'}
                    onChange={() => setReleaseType('album')}
                  />
                  Album / EP (Multiple tracks)
                </RadioOption>
              </RadioGroup>
            </FormGroup>

            {/* General Release Details */}
            <FormSectionTitle>General Release Details</FormSectionTitle>
            <FormGroup>
              <Label htmlFor="release-artist-name">Artist Name(s)</Label>
              <Input
                type="text"
                id="release-artist-name"
                value={releaseArtistName}
                onChange={(e) => setReleaseArtistName(e.target.value)}
                placeholder="e.g., Aurora Bloom (use commas for multiple artists)"
                required
              />
            </FormGroup>
            {releaseType === 'album' && (
              <FormGroup>
                <Label htmlFor="album-name">Album Name</Label>
                <Input
                  type="text"
                  id="album-name"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  placeholder="e.g., Celestial Harmonies"
                  required={releaseType === 'album'}
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label htmlFor="genre">Genre</Label>
              <Select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              >
                <option value="">Select a Genre</option>
                <option value="Electronic">Electronic</option>
                <option value="Acoustic">Acoustic</option>
                <option value="Experimental">Experimental</option>
                <option value="Folk">Folk</option>
                <option value="Instrumental">Instrumental</option>
                <option value="Ambient">Ambient</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Metal">Metal</option>
                <option value="Blues">Blues</option>
                <option value="Country">Country</option>
                <option value="Reggae">Reggae</option>
                <option value="World">World</option>
                {/* Add more genres as needed */}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="release-date">Release Date</Label>
              <Input
                type="date"
                id="release-date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us more about your release..."
              />
            </FormGroup>

            {/* Artwork Upload */}
            <FormSectionTitle>Album Artwork</FormSectionTitle>
            <FormGroup>
              <Label htmlFor="artwork-file">Artwork (JPG, PNG - Min. 1000x1000px)</Label>
              <FileDropArea
                $isDragActive={isDragActive}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'artwork')}
                onClick={() => document.getElementById('artwork-file')?.click()}
              >
                <FileInput
                  type="file"
                  id="artwork-file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileSelect(e, 'artwork')}
                  required
                />
                <UploadIconWrapper><ImageIcon size={48} /></UploadIconWrapper>
                <p>Drag &amp; drop your artwork here, or click to browse</p>
                {artworkFile && <p style={{ color: theme.text }}>Selected: {artworkFile.name}</p>}
                {artworkPreviewUrl && <ArtworkPreview src={artworkPreviewUrl} alt="Artwork Preview" />}
              </FileDropArea>
            </FormGroup>

            {/* Tracks Section */}
            <FormSectionTitle>{releaseType === 'single' ? 'Track Details' : 'Tracks'}</FormSectionTitle>
            {tracks.map((track, index) => (
              <React.Fragment key={track.id}>
                {releaseType === 'album' && <h4 style={{ color: theme.text, marginBottom: '0.5rem', marginTop: index > 0 ? '1.5rem' : '0' }}>Track {index + 1}</h4>}
                <FormGroup>
                  <Label htmlFor={`track-title-${track.id}`}>Track Title</Label>
                  <Input
                    type="text"
                    id={`track-title-${track.id}`}
                    value={track.title}
                    onChange={(e) => handleTrackTitleChange(track.id, e.target.value)}
                    placeholder={`e.g., Track ${index + 1} Title`}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor={`audio-file-${track.id}`}>Audio File (MP3, WAV, FLAC)</Label>
                  <FileDropArea
                    $isDragActive={isDragActive}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'track', track.id)}
                    onClick={() => document.getElementById(`audio-file-${track.id}`)?.click()}
                  >
                    <FileInput
                      type="file"
                      id={`audio-file-${track.id}`}
                      accept="audio/mpeg, audio/wav, audio/flac"
                      onChange={(e) => handleFileSelect(e, 'track', track.id)}
                      required
                    />
                    <UploadIconWrapper><Music size={48} /></UploadIconWrapper>
                    <p>Drag &amp; drop audio for &#34;{track.title || `Track ${index + 1}`}&#34; here, or click to browse</p>
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

            {/* Licensing Section */}
            <FormSectionTitle>Licensing</FormSectionTitle>
            <FormGroup>
              <Label>Choose your licensing option:</Label>
              <RadioGroup>
                <RadioOption>
                  <input
                    type="radio"
                    name="licensing"
                    value="proprietary"
                    checked={licensing === 'proprietary'}
                    onChange={() => { setLicensing('proprietary'); setCcType(null); }}
                  />
                  Proprietary (Exclusive to Waveform.ink, no external export)
                  <Info size={16} style={{ color: theme.subtleText }} />
                  <span style={{ color: theme.subtleText, fontSize: '0.85rem' }}>This option means your music will be exclusively available within the Waveform app for streaming and in-app offline playback only. It cannot be exported or used outside the app.</span>
                </RadioOption>
                <RadioOption>
                  <input
                    type="radio"
                    name="licensing"
                    value="cc"
                    checked={licensing === 'cc'}
                    onChange={() => setLicensing('cc')}
                  />
                  Creative Commons (Open for broader use, with attribution)
                  <Info size={16} style={{ color: theme.subtleText }} />
                  <span style={{ color: theme.subtleText, fontSize: '0.85rem' }}>Creative Commons licenses allow others to use your work with certain conditions. Downloads of CC content may be exportable from the app based on the specific license.</span>
                </RadioOption>
              </RadioGroup>
            </FormGroup>

            {licensing === 'cc' && (
              <FormGroup>
                <Label>Creative Commons Type:</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      value="BY"
                      checked={ccType === 'BY'}
                      onChange={() => setCcType(ccType === 'BY' ? null : 'BY')}
                    />
                    Attribution (BY)
                    <Info size={16} style={{ color: theme.subtleText }} />
                    <span style={{ color: theme.subtleText, fontSize: '0.85rem' }}>Allows others to distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation.</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      value="BY-SA"
                      checked={ccType === 'BY-SA'}
                      onChange={() => setCcType(ccType === 'BY-SA' ? null : 'BY-SA')}
                    />
                    Attribution-ShareAlike (BY-SA)
                    <Info size={16} style={{ color: theme.subtleText }} />
                    <span style={{ color: theme.subtleText, fontSize: '0.85rem' }}>Allows others to remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under identical terms.</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      value="BY-NC"
                      checked={ccType === 'BY-NC'}
                      onChange={() => setCcType(ccType === 'BY-NC' ? null : 'BY-NC')}
                    />
                    Attribution-NonCommercial (BY-NC)
                    <Info size={16} style={{ color: theme.subtleText }} />
                    <span style={{ color: theme.subtleText, fontSize: '0.85rem' }}>Allows others to remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.</span>
                  </CheckboxOption>
                  {/* Add more CC types as needed */}
                </CheckboxGroup>
                {!ccType && <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.5rem' }}>Please select a Creative Commons type.</p>}
              </FormGroup>
            )}

            {/* Collaborator Splits (Placeholder) */}
            <FormSectionTitle>Collaborator Splits (Coming Soon)</FormSectionTitle>
            <FormGroup>
              <InfoMessage>
                <Info size={18} />
                This feature will allow you to add collaborators and define their royalty percentages.
              </InfoMessage>
            </FormGroup>

            {/* Submit Button */}
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

            {/* Status Messages */}
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
