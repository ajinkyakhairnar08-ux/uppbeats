import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Plus, Maximize2 } from 'lucide-react';

const Player = () => {
  const { currentSong, isPlaying, setIsPlaying, nextSong, prevSong, volume, setVolume, toggleShuffle, toggleLoop, isShuffle, isLoop, setIsFullScreen, customPlaylists, addToCustomPlaylist, currentTime, duration, setCurrentTime, setDuration, seekToTime, setSeekToTime } = useStore();
  const [player, setPlayer] = useState(null);
  const playerRef = useRef(null);
  const isLoadingNewSong = useRef(false);

  const initializePlayer = () => {
    if (!window.YT || !window.YT.Player) return;
    new window.YT.Player('youtube-player', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          event.target.setVolume(useStore.getState().volume);
        },
        onStateChange: (event) => {
          const state = useStore.getState();
          if (event.data === window.YT.PlayerState.ENDED) {
            isLoadingNewSong.current = false;
            state.nextSong();
          } else if (event.data === window.YT.PlayerState.PLAYING) {
            isLoadingNewSong.current = false;
            state.setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            // Ignore the spurious PAUSED event YouTube fires when loading a new video.
            // Only update state if this was a real user-initiated pause.
            if (!isLoadingNewSong.current) {
              state.setIsPlaying(false);
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else if (!player) {
      initializePlayer();
    }
  }, []);

  useEffect(() => {
    if (player && currentSong) {
      if (typeof player.loadVideoById === 'function') {
        isLoadingNewSong.current = true;  // Guard against spurious PAUSED event
        player.loadVideoById(currentSong.id);
        player.unMute();
        player.setVolume(volume);
        player.playVideo();
      }
    }
  }, [currentSong, player]);

  useEffect(() => {
    if (player) {
      if (isPlaying) player.playVideo();
      else player.pauseVideo();
    }
  }, [isPlaying, player]);

  useEffect(() => {
    if (player) player.setVolume(volume);
  }, [volume, player]);

  useEffect(() => {
    let interval;
    if (isPlaying && player) {
      interval = setInterval(() => {
        if (player.getCurrentTime) {
          setCurrentTime(player.getCurrentTime());
          setDuration(player.getDuration());
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player, setCurrentTime, setDuration]);

  useEffect(() => {
    if (player && seekToTime !== null) {
      if (player.seekTo) {
        player.seekTo(seekToTime, true);
      }
      setSeekToTime(null);
    }
  }, [seekToTime, player, setSeekToTime]);

  const formatTime = (time) => {
    if (!time) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="player-container glass-panel" style={{ bottom: 0, zIndex: 100 }}>
      <div id="youtube-player" style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', top: 0, left: 0 }}></div>
      
      {!currentSong ? (
        <div style={{ color: 'var(--text-secondary)', padding: '0 24px' }}>Select a song to play</div>
      ) : (
        <>
          <div className="player-info" onClick={() => setIsFullScreen(true)}>
            <img src={currentSong.thumbnail} alt={currentSong.title} className="player-thumbnail" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.channelTitle}</span>
            </div>
          </div>

          <div className="player-controls">
            <div className="player-buttons">
              <button className={`control-btn ${isShuffle ? 'active' : ''}`} onClick={toggleShuffle}>
                <Shuffle size={20} />
              </button>
              <button className="control-btn" onClick={prevSong}>
                <SkipBack size={24} />
              </button>
              <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '4px' }} />}
              </button>
              <button className="control-btn" onClick={nextSong}>
                <SkipForward size={24} />
              </button>
              <button className={`control-btn ${isLoop ? 'active' : ''}`} onClick={toggleLoop}>
                <Repeat size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '400px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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

          <div className="player-settings">
            <select 
              onChange={(e) => {
                if (e.target.value) {
                  addToCustomPlaylist(Number(e.target.value), currentSong);
                  e.target.value = "";
                }
              }}
              className="input"
              style={{ width: '40px', padding: '4px', background: 'transparent', border: 'none', color: 'white' }}
              title="Add to Playlist"
            >
              <option value="" style={{ color: 'black' }}>+</option>
              {customPlaylists.map(pl => (
                <option key={pl.id} value={pl.id} style={{ color: 'black' }}>{pl.name}</option>
              ))}
            </select>

            <Volume2 size={20} color="var(--text-secondary)" />
            <input 
              type="range" 
              min="0" max="100" 
              value={volume} 
              onChange={(e) => setVolume(e.target.value)}
              className="volume-slider"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
