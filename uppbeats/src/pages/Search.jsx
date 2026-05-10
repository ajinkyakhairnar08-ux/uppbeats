import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchSongs } from '../utils/youtube';
import { useStore } from '../store/useStore';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const setCurrentSong = useStore((state) => state.setCurrentSong);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const data = await searchSongs(query, 30);
      setResults(data);
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>
        {query ? `Search results for "${query}"` : 'Browse all'}
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#b3b3b3' }}>Searching for songs...</div>
      ) : (
        <div className="song-grid">
          {results.map((song) => (
            <div
              key={song.id}
              className="song-card glass"
              onClick={() => setCurrentSong(song, results)}
            >
              <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
              <div className="song-info">
                <span className="song-title">{song.title}</span>
                <span className="song-artist">{song.channelTitle}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#b3b3b3' }}>
          No results found for "{query}".
        </div>
      )}
    </div>
  );
};

export default SearchPage;
