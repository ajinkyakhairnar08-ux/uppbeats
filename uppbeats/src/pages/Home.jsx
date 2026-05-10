import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getTopUsaSongs, getTopIndiaSongs, searchSongs } from '../utils/youtube';
import { Play, Loader2 } from 'lucide-react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const SongRow = ({ title, songs }) => {
  const setCurrentSong = useStore((state) => state.setCurrentSong);

  if (!songs || songs.length === 0) return null;

  return (
    <div className="song-section">
      <h2 className="song-section-title">{title}</h2>
      <div className="song-scroll-row">
        {songs.map((song, i) => (
          <div
            key={`${song.id}-${i}`}
            className="song-scroll-card glass"
            onClick={() => setCurrentSong(song, songs)}
          >
            <div style={{ position: 'relative' }}>
              <img src={song.thumbnail} alt={song.title} className="song-scroll-img" />
              <div className="play-btn-overlay" style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--accent)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <Play fill="white" size={20} />
              </div>
            </div>
            <h3 className="song-scroll-title">{song.title}</h3>
            <p className="song-scroll-artist">{song.channelTitle}</p>
          </div>
        ))}
      </div>
      <style>{`
        .glass:hover .play-btn-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
};


const Home = () => {
  const [topUsaSongs, setTopUsaSongs] = useState([]);
  const [topIndiaSongs, setTopIndiaSongs] = useState([]);
  const [hindiSongs, setHindiSongs] = useState([]);
  const [englishSongs, setEnglishSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const greeting = getGreeting();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [usa, india, hindi, english] = await Promise.all([
        getTopUsaSongs(),
        getTopIndiaSongs(),
        searchSongs('latest hindi songs', 20),
        searchSongs('top english pop songs', 20)
      ]);
      setTopUsaSongs(usa);
      setTopIndiaSongs(india);
      setHindiSongs(hindi);
      setEnglishSongs(english);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button style={{ background: 'white', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '500px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}>All</button>
        <button style={{ background: '#242424', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '500px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}>Music</button>
        <button style={{ background: '#242424', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '500px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}>Podcasts</button>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '24px', fontWeight: '700' }}>{greeting}</h1>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
          <Loader2 size={48} color="#1db954" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : (
        <>
          <SongRow title="Top 50 USA" songs={topUsaSongs} />
          <SongRow title="Top 50 India" songs={topIndiaSongs} />
          <SongRow title="Automated Hindi Mix" songs={hindiSongs} />
          <SongRow title="Automated English Mix" songs={englishSongs} />
        </>
      )}
    </div>
  );
};

export default Home;
