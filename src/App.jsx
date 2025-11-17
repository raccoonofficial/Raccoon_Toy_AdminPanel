import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MusicContext from './assets/MusicContext';
import backgroundMusic from './assets/music/loverboy.mp3';

// Import all components for routing
import AdminPanel from './assets/Admin_Panel';
import Login from './assets/Login';
import AdminDashboard from './assets/Admin_Dashboard';
import AdminProducts from './assets/Admin_Products';
import AdminCustomersPage from './assets/Admin_Customers';
import AddCustomersPage from './assets/Add_Customers';
import Admin_Orders from './assets/Admin_Orders';
import Finance from './assets/Finance';
import Add_Products from './assets/Add_Products';
import Add_Orders from './assets/Add_Orders';
import MusicPlayer from './assets/MusicPlayer';
import './App.css';

const playlist = [
  { id: 1, title: 'Loverboy', artist: 'A-Wall', src: backgroundMusic, artwork: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=L' },
  { id: 2, title: 'Sunset Cruise', artist: 'Synthwave Kid', src: backgroundMusic, artwork: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=S' },
  { id: 3, title: 'Midnight City', artist: 'M83', src: backgroundMusic, artwork: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=M' },
  { id: 4, title: 'Echoes in Rain', artist: 'Enya', src: backgroundMusic, artwork: 'https://via.placeholder.com/150/20B2AA/FFFFFF?text=E' },
];

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const userName = "ninjashamimkabirkazim";
  const currentDate = new Date('2025-11-17T07:23:55Z');
  const navigate = useNavigate();

  const getInitialState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => getInitialState('lastTime', 0));
  const [volume, setVolume] = useState(() => getInitialState('volume', 0.3));
  const [isMuted, setIsMuted] = useState(() => getInitialState('isMuted', false));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const lastTrackId = getInitialState('lastTrackId', 1);
    const index = playlist.findIndex(t => t.id === lastTrackId);
    return index !== -1 ? index : 0;
  });
  const [repeatMode, setRepeatMode] = useState(() => getInitialState('repeatMode', 'none'));
  const [isShuffled, setIsShuffled] = useState(() => getInitialState('isShuffled', false));
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);

  const audioRef = useRef(new Audio(playlist[currentTrackIndex]?.src || ''));
  const activePlaylist = isShuffled ? shuffledPlaylist : playlist;
  const currentTrackId = activePlaylist[currentTrackIndex]?.id;

  useEffect(() => { localStorage.setItem('volume', JSON.stringify(volume)); }, [volume]);
  useEffect(() => { localStorage.setItem('isMuted', JSON.stringify(isMuted)); }, [isMuted]);
  useEffect(() => { localStorage.setItem('repeatMode', JSON.stringify(repeatMode)); }, [repeatMode]);
  useEffect(() => { localStorage.setItem('isShuffled', JSON.stringify(isShuffled)); }, [isShuffled]);
  useEffect(() => { if (currentTrackId) localStorage.setItem('lastTrackId', JSON.stringify(currentTrackId)); }, [currentTrackId]);
  useEffect(() => {
    const saveTime = () => localStorage.setItem('lastTime', JSON.stringify(audioRef.current.currentTime));
    window.addEventListener('beforeunload', saveTime);
    return () => window.removeEventListener('beforeunload', saveTime);
  }, []);
  
  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < activePlaylist.length) {
        setCurrentTrackIndex(nextIndex);
      } else if (repeatMode === 'all') {
        setCurrentTrackIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [repeatMode, currentTrackIndex, activePlaylist]);

  useEffect(() => {
    const audio = audioRef.current;
    const newSrc = activePlaylist[currentTrackIndex]?.src;
    if (audio.src !== newSrc) {
      audio.src = newSrc;
      audio.currentTime = getInitialState('lastTime', 0); // Restore time only when track changes
      localStorage.setItem('lastTime', '0'); // Reset saved time for new track
    }

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleTrackEnd);

    isPlaying ? audio.play().catch(e => console.error("Autoplay failed:", e)) : audio.pause();

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex, activePlaylist, isPlaying, handleTrackEnd]);

  useEffect(() => { audioRef.current.volume = isMuted ? 0 : volume; }, [volume, isMuted]);

  useEffect(() => {
    if (isShuffled) {
      const currentTrack = playlist.find(track => track.id === currentTrackId);
      const otherTracks = playlist.filter(track => track.id !== currentTrackId);
      const shuffled = [currentTrack, ...otherTracks.sort(() => Math.random() - 0.5)];
      setShuffledPlaylist(shuffled);
      setCurrentTrackIndex(0);
    }
  }, [isShuffled, playlist, currentTrackId]);

  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      switch (e.code) {
        case 'Space': togglePlayPause(); break;
        case 'ArrowRight': handleSeek(Math.min(currentTime + 5, duration)); break;
        case 'ArrowLeft': handleSeek(Math.max(currentTime - 5, 0)); break;
        case 'ArrowUp': setVolume(v => Math.min(v + 0.05, 1)); break;
        case 'ArrowDown': setVolume(v => Math.max(v - 0.05, 0)); break;
        case 'KeyM': setIsMuted(m => !m); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1);
    if (nextIndex < activePlaylist.length) { setCurrentTrackIndex(nextIndex); } 
    else if (repeatMode === 'all') { setCurrentTrackIndex(0); }
  };
  const playPrevTrack = () => {
    const prevIndex = (currentTrackIndex - 1);
    if (prevIndex >= 0) { setCurrentTrackIndex(prevIndex); } 
    else if (repeatMode === 'all') { setCurrentTrackIndex(activePlaylist.length - 1); }
  };
  const playTrackById = (trackId) => {
    const trackIndex = activePlaylist.findIndex(track => track.id === trackId);
    if (trackIndex !== -1) { setCurrentTrackIndex(trackIndex); setIsPlaying(true); }
  };

  const contextValue = {
    isPlaying, duration, currentTime, volume, isMuted, currentTrack: activePlaylist[currentTrackIndex], playlist: activePlaylist,
    repeatMode, isShuffled, togglePlayPause, playNextTrack, playPrevTrack, playTrackById, handleSeek, setVolume, setIsMuted, setRepeatMode, setIsShuffled
  };

  return (
    <MusicContext.Provider value={contextValue}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><AdminPanel /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard userName={userName} date={currentDate} />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<Add_Products />} />
            <Route path="users" element={<AdminCustomersPage />} />
            <Route path="users/add" element={<AddCustomersPage />} />
            <Route path="orders" element={<Admin_Orders onAddNew={() => navigate('/orders/add')} />} />
            <Route path="orders/add" element={<Add_Orders onBack={() => navigate('/orders')} onCreated={() => navigate('/orders')} />} />
            <Route path="finance" element={<Finance />} />
            <Route path="music" element={<MusicPlayer />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </MusicContext.Provider>
  );
}
export default App;