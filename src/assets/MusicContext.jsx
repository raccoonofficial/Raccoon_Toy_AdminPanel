import { createContext } from 'react';

// This context will provide the audio state and control functions to any component that needs it.
const MusicContext = createContext({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 0.3,
    isMuted: false,
    currentTrack: null,
    playlist: [],
    repeatMode: 'none',
    isShuffled: false,
    togglePlayPause: () => {},
    playNextTrack: () => {},
    playPrevTrack: () => {},
    playTrackById: () => {},
    handleSeek: () => {},
    setVolume: () => {},
    setIsMuted: () => {},
    setRepeatMode: () => {},
    setIsShuffled: () => {},
    addTracks: () => {},
});

export default MusicContext;