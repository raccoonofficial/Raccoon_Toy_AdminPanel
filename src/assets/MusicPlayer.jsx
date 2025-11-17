import React, { useContext, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, Shuffle, Music, ChevronsRight, ChevronsLeft } from 'lucide-react';
import MusicContext from './MusicContext';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const {
    isPlaying, duration, currentTime, volume, isMuted, currentTrack, playlist,
    repeatMode, isShuffled, togglePlayPause, playNextTrack, playPrevTrack, 
    playTrackById, handleSeek, setVolume, setIsMuted, setRepeatMode, setIsShuffled
  } = useContext(MusicContext);

  const [isMiniMode, setIsMiniMode] = useState(false);
  const progressBarRef = useRef(null);

  if (!currentTrack) {
    return <div className="loading-player">Loading Music Player...</div>;
  }

  const handleProgressChange = (e) => {
    if (progressBarRef.current && duration > 0) {
      const newTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
      handleSeek(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) setIsMuted(false);
  };
  
  const toggleRepeatMode = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`player-layout ${isMiniMode ? 'mini-mode' : ''}`}>
      <div className="music-player-container">
        <div className="track-info">
          <img src={currentTrack.artwork} alt="Album Art" className="album-art" />
          <h2 className="track-title">{currentTrack.title}</h2>
          <h3 className="track-artist">{currentTrack.artist}</h3>
        </div>

        <div className="progress-section">
          <div className="progress-bar-container" onClick={handleProgressChange} ref={progressBarRef}>
            <div className="progress-bar" style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}></div>
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="main-controls">
          <button onClick={() => setIsShuffled(!isShuffled)} className={`control-btn mode-btn ${isShuffled ? 'active' : ''}`} title="Shuffle">
            <Shuffle size={20} />
          </button>
          <button onClick={playPrevTrack} className="control-btn" title="Previous Track"><SkipBack size={28} /></button>
          <button onClick={togglePlayPause} className="control-btn play-pause-btn" title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={36} /> : <Play size={36} />}
          </button>
          <button onClick={playNextTrack} className="control-btn" title="Next Track"><SkipForward size={28} /></button>
          <button onClick={toggleRepeatMode} className={`control-btn mode-btn ${repeatMode !== 'none' ? 'active' : ''}`} title={`Repeat: ${repeatMode}`}>
            {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        <div className="volume-control">
          <button onClick={() => setIsMuted(!isMuted)} className="control-btn mute-btn" title={isMuted ? "Unmute" : "Mute"}>
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="volume-slider" title={`Volume: ${Math.round(volume*100)}%`} />
        </div>
      </div>

      <div className="playlist-container">
        <div className="playlist-header">
          <h3 className="playlist-title">Now Playing</h3>
          <button className="control-btn mini-mode-toggle" onClick={() => setIsMiniMode(!isMiniMode)} title={isMiniMode ? "Show Playlist" : "Hide Playlist"}>
            {isMiniMode ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
        </div>
        <ul className="playlist">
          {playlist.map((track) => (
            <li 
              key={track.id} 
              className={`playlist-item ${currentTrack.id === track.id ? 'active' : ''}`}
              onClick={() => playTrackById(track.id)}
            >
              <img src={track.artwork} alt={track.title} className="playlist-item-artwork" />
              <div className="playlist-item-info">
                <span className="playlist-item-title">{track.title}</span>
                <span className="playlist-item-artist">{track.artist}</span>
              </div>
              {currentTrack.id === track.id && (
                <div className="playing-indicator">
                  {isPlaying ? (
                    <><span></span><span></span><span></span></>
                  ) : (
                    <Music size={16} />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;