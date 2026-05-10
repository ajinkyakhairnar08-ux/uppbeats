import React from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown } from 'lucide-react';

const FullScreenPlayer = () => {
  const { currentSong, isPlaying, setIsPlaying, nextSong, prevSong, isFullScreen, setIsFullScreen, playlist, currentIndex, toggleShuffle, toggleLoop, isShuffle, isLoop, setCurrentSong, currentTime, duration, setSeekToTime } = useStore();

  const formatTime = (time) => {
    if (!time) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isFullScreen || !currentSong) return null;

  // Next songs in the queue
  const nextSongs = playlist.slice(currentIndex + 1);

  return (
    <div className={`full-screen-player ${isFullScreen ? 'active' : ''}`}>
      <div className="fs-header">
        <button className="fs-close" onClick={() => setIsFullScreen(false)}>
          <ChevronDown size={32} />
        </button>
        <div style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Now Playing
        </div>
        <div style={{ width: '48px' }}></div> {/* Spacer */}
      </div>

      <div className="fs-content">
        <div className="fs-left">
          <img src={currentSong.thumbnail} alt={currentSong.title} className="fs-thumbnail" />
          
          <div className="fs-info">
            <div className="fs-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</div>
            <div className="fs-artist">{currentSong.channelTitle}</div>
          </div>

          <div className="player-buttons" style={{ transform: 'scale(1.2)', marginTop: '20px' }}>
            <button className={`control-btn ${isShuffle ? 'active' : ''}`} onClick={toggleShuffle}>
              <Shuffle size={20} />
            </button>
            <button className="control-btn" onClick={prevSong}>
              <SkipBack size={28} />
            </button>
            <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)} style={{ width: '64px', height: '64px' }}>
              {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
            </button>
            <button className="control-btn" onClick={nextSong}>
              <SkipForward size={28} />
            </button>
            <button className={`control-btn ${isLoop ? 'active' : ''}`} onClick={toggleLoop}>
              <Repeat size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '500px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '24px' }}>
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={currentTime} 
              onChange={(e) => setSeekToTime(parseFloat(e.target.value))}
              className="volume-slider"
              style={{ flex: 1, height: '4px' }}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="fs-right glass">
          <h3 className="fs-next-songs-title">Next in queue</h3>
          {nextSongs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {nextSongs.map((song) => (
                <div 
                  key={song.id} 
                  className="fs-next-song-item"
                  onClick={() => setCurrentSong(song)}
                >
                  <img src={song.thumbnail} alt={song.title} className="fs-next-thumb" />
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.channelTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px' }}>
              No more songs in the queue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;
