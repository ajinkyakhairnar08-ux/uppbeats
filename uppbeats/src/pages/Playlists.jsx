import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Play } from 'lucide-react';

const Playlists = () => {
  const customPlaylists = useStore((state) => state.customPlaylists);
  const createCustomPlaylist = useStore((state) => state.createCustomPlaylist);
  const setCurrentSong = useStore((state) => state.setCurrentSong);
  const [newPlName, setNewPlName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (newPlName.trim()) {
      createCustomPlaylist(newPlName);
      setNewPlName('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Your Library</h1>
      
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <input 
          type="text" 
          value={newPlName} 
          onChange={(e) => setNewPlName(e.target.value)} 
          placeholder="New playlist name..." 
          className="input glass"
          style={{ width: '300px' }}
        />
        <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Create
        </button>
      </form>

      <div style={{ display: 'grid', gap: '40px' }}>
        {customPlaylists.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }}>No playlists yet. Create one!</div>
        ) : (
          customPlaylists.map(pl => (
            <div key={pl.id} className="glass" style={{ padding: '24px' }}>
              <h2 style={{ marginBottom: '20px' }}>{pl.name} ({pl.songs.length} songs)</h2>
              <div className="song-grid">
                {pl.songs.map((song) => (
                  <div 
                    key={song.id} 
                    className="song-card glass"
                    onClick={() => setCurrentSong(song, pl.songs)}
                  >
                    <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
                    <div className="song-info">
                      <span className="song-title">{song.title}</span>
                      <span className="song-artist">{song.channelTitle}</span>
                    </div>
                  </div>
                ))}
              </div>
              {pl.songs.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add songs from the player context menu (to be implemented).</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;
