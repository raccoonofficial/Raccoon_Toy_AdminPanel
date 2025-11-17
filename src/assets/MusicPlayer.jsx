import React, { useContext, useRef } from 'react';
import {
    Shuffle, SkipBack, PlayCircle, PauseCircle, SkipForward, Repeat, Repeat1,
    Volume2, Upload, ListMusic
} from 'lucide-react';
import MusicContext from './MusicContext';
import './MusicPlayer.css';

const MusicPlayer = () => {
    const {
        isPlaying, duration, currentTime, volume, isMuted, currentTrack, playlist,
        repeatMode, isShuffled, togglePlayPause, playNextTrack, playPrevTrack,
        playTrackById, handleSeek, setVolume, setIsMuted, setRepeatMode, setIsShuffled,
        addTracks
    } = useContext(MusicContext);

    const fileInputRef = useRef(null);
    const progressBarRef = useRef(null);
    const volumeBarRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const formatTime = (time) => {
        if (isNaN(time) || time < 0) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleProgressClick = (e) => {
        if (progressBarRef.current && duration > 0) {
            const progressBar = progressBarRef.current;
            const clickPositionX = e.clientX - progressBar.getBoundingClientRect().left;
            const newTime = (clickPositionX / progressBar.offsetWidth) * duration;
            handleSeek(newTime);
        }
    };
    
    const handleVolumeClick = (e) => {
        if (volumeBarRef.current) {
            const volumeBar = volumeBarRef.current;
            const clickPositionX = e.clientX - volumeBar.getBoundingClientRect().left;
            let newVolume = clickPositionX / volumeBar.offsetWidth;
            newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp between 0 and 1
            setVolume(newVolume);
            if (isMuted) setIsMuted(false);
        }
    };

    const toggleRepeatMode = () => {
        if (repeatMode === 'none') setRepeatMode('all');
        else if (repeatMode === 'all') setRepeatMode('one');
        else setRepeatMode('none');
    };

    if (!currentTrack) {
        return (
            <div className="loading-player-container">
                <h2>No track selected</h2>
                <p>Upload your local music to start listening.</p>
                <button onClick={handleUploadClick} className="upload-initial-btn">
                    <Upload size={18} /> Upload Music
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={(e) => addTracks(e.target.files)}
                />
            </div>
        );
    }

    return (
        <div className="music-player-wrapper">
             <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => addTracks(e.target.files)}
            />

            <div className="music-player-main-content">
                <aside className="music-playlist-sidebar">
                    <div className="library-header">
                        <ListMusic />
                        <p>Your Playlist</p>
                    </div>
                    <div className="playlist-list">
                        {playlist.map(track => (
                            <a 
                                href="#" 
                                key={track.id} 
                                className={track.id === currentTrack.id ? 'active' : ''}
                                onClick={(e) => { e.preventDefault(); playTrackById(track.id); }}
                            >
                                {track.title}
                            </a>
                        ))}
                    </div>
                     <button onClick={handleUploadClick} className="upload-sidebar-btn">
                        <Upload size={16} /> Upload Music
                    </button>
                </aside>

                <main className="music-cards-area">
                    <header className="music-area-header">
                        <h3>Now Playing</h3>
                    </header>
                    <div className="cards-grid">
                        {playlist.map((track) => (
                             <div 
                                key={track.id} 
                                className={`card ${track.id === currentTrack.id ? 'active' : ''}`}
                                onClick={() => playTrackById(track.id)}
                            >
                                <img src={track.artwork} alt={`${track.title} cover`} />
                                <p className="card-title">{track.title}</p>
                                <p className="card-subtitle">{track.artist}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            
            <footer className="music-player-footer">
                <div className="song-info">
                    <img src={currentTrack.artwork} alt="Album Art" className="album-art" />
                    <div className="song-details">
                        <p className="song-title">{currentTrack.title}</p>
                        <p className="song-artist">{currentTrack.artist}</p>
                    </div>
                </div>
                <div className="player-controls">
                    <div className="controls">
                        <button onClick={() => setIsShuffled(!isShuffled)} className={`control-btn ${isShuffled ? 'active' : ''}`}><Shuffle size={18} /></button>
                        <button onClick={playPrevTrack} className="control-btn"><SkipBack size={20} /></button>
                        <button onClick={togglePlayPause} className="play-pause-btn">
                            {isPlaying ? <PauseCircle size={36} /> : <PlayCircle size={36} />}
                        </button>
                        <button onClick={playNextTrack} className="control-btn"><SkipForward size={20} /></button>
                        <button onClick={toggleRepeatMode} className={`control-btn ${repeatMode !== 'none' ? 'active' : ''}`}>
                            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                        </button>
                    </div>
                    <div className="progress-bar-container">
                        <span className="current-time">{formatTime(currentTime)}</span>
                        <div className="progress-bar" onClick={handleProgressClick} ref={progressBarRef}>
                            <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                        </div>
                        <span className="total-time">{formatTime(duration)}</span>
                    </div>
                </div>
                <div className="volume-controls">
                    <Volume2 />
                    <div className="volume-bar" onClick={handleVolumeClick} ref={volumeBarRef}>
                        <div className="volume-level" style={{ width: `${isMuted ? 0 : volume * 100}%` }}></div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MusicPlayer;