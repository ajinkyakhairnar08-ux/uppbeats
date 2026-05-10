import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home as HomeIcon, Library, Plus, Bell, User, Download, Heart } from 'lucide-react';
import { useStore } from './store/useStore';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import Playlists from './pages/Playlists';
import Player from './components/Player';
import FullScreenPlayer from './components/FullScreenPlayer';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const topArtists = [
    "Arijit Singh", "The Weeknd", "Diljit Dosanjh", "AP Dhillon", "King",
    "Taylor Swift", "Drake", "Badshah", "Ed Sheeran", "Billie Eilish",
    "Post Malone", "Bruno Mars", "Dua Lipa", "Shreya Ghoshal", "Justin Bieber",
    "Rihanna", "Eminem", "Kishore Kumar", "Lana Del Rey", "Travis Scott"
  ];
  
  return (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="glass" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '16px', height: '16px', border: '3px solid black', borderRadius: '50%' }}></div>
          </div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Uppbeats</h1>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '20px', color: location.pathname === '/' ? 'white' : '#b3b3b3', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', transition: 'color 0.2s' }}>
            <HomeIcon size={24} fill={location.pathname === '/' ? 'white' : 'none'} /> Home
          </Link>
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '20px', color: location.pathname === '/search' ? 'white' : '#b3b3b3', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', transition: 'color 0.2s' }}>
            <Search size={24} /> Search
          </Link>
        </nav>
      </div>

      <div className="glass" style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', color: '#b3b3b3' }}>
          <Link to="/playlists" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }}>
            <Library size={24} /> Your Library
          </Link>
          <button style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><Plus size={20} /></button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1a1a1a'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: 'linear-gradient(135deg, #450af5, #8e8ee5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart fill="white" stroke="none" size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '600', color: 'white' }}>Liked Songs</span>
              <span style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>📌 Playlist • 1 song</span>
            </div>
          </div>

          {topArtists.map((artist, idx) => (
            <div key={idx} onClick={() => navigate(`/search?q=${encodeURIComponent(artist)}`)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#1a1a1a'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(artist)}&background=242424&color=fff&rounded=true&bold=true`} alt={artist} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600', color: 'white' }}>{artist}</span>
                <span style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Artist</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TopNav = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const debounceRef = React.useRef(null);

  const popularSuggestions = [
    'Arijit Singh songs', 'Top Bollywood hits', 'The Weeknd', 'Taylor Swift',
    'Diljit Dosanjh', 'AP Dhillon', 'Ed Sheeran', 'Drake', 'Badshah', 'King',
    'Punjabi songs', 'Hindi love songs', 'English pop 2024', 'Lofi beats',
    'Bruno Mars', 'Billie Eilish', 'Post Malone', 'Dua Lipa', 'Justin Bieber', 'Eminem'
  ];

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (newQuery.trim()) {
      // Generate smart suggestions from popular list + variations
      const filtered = popularSuggestions
        .filter(s => s.toLowerCase().includes(newQuery.toLowerCase()))
        .slice(0, 5);
      const extras = [newQuery, `${newQuery} songs`, `${newQuery} latest`]
        .filter(s => !filtered.map(f => f.toLowerCase()).includes(s.toLowerCase()));
      setSuggestions([...filtered, ...extras].slice(0, 6));

      // Debounced full navigation to results
      debounceRef.current = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(newQuery)}`);
      }, 400);
    } else {
      setSuggestions(popularSuggestions.slice(0, 6));
      navigate('/');
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(s)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        <button style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#242424', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={() => { setQuery(''); setShowDropdown(false); navigate('/'); }}>
          <HomeIcon size={24} />
        </button>
        <div style={{ position: 'relative' }}>
          <form onSubmit={handleSubmit} className="search-bar" style={{ margin: 0 }}>
            <Search size={20} color="#b3b3b3" />
            <input
              type="text"
              placeholder="What do you want to play?"
              className="search-input"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => { setIsFocused(true); setShowDropdown(true); if (!query) setSuggestions(popularSuggestions.slice(0, 6)); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
          </form>

          {showDropdown && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: '#282828', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 1000, overflow: 'hidden', minWidth: '400px'
            }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onMouseDown={() => handleSuggestionClick(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #333' : 'none',
                    transition: 'background 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#3e3e3e'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Search size={16} color="#b3b3b3" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'white' }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'transparent', border: 'none', color: '#b3b3b3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={20} />
        </button>
        <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#242424', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <User size={20} />
        </button>
      </div>
    </div>
  );
};

// Mobile bottom navigation bar
const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSong = useStore((s) => s.currentSong);

  const tabs = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/playlists' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', background: 'transparent', border: 'none',
              color: active ? 'white' : '#b3b3b3', cursor: 'pointer',
              fontSize: '0.7rem', fontWeight: active ? '700' : '400', fontFamily: 'inherit',
              transition: 'color 0.2s'
            }}
          >
            <Icon size={22} fill={active && label === 'Home' ? 'white' : 'none'} />
            {label}
          </button>
        );
      })}
    </nav>
  );
};

function App() {
  const currentSong = useStore((state) => state.currentSong);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Desktop sidebar — hidden on mobile via CSS */}
        <Sidebar />

        <main className="main-content">
          <TopNav />
          <div style={{ padding: '0 16px 16px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/playlists" element={<Playlists />} />
            </Routes>
          </div>
        </main>

        {/* Desktop Now Playing sidebar — hidden on mobile via CSS */}
        {currentSong && (
          <aside className="now-playing-sidebar">
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentSong.title}
            </h2>
            <img src={currentSong.thumbnail} alt={currentSong.title} style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover' }} />

            <div style={{ background: '#242424', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>Credits</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{currentSong.channelTitle}</div>
                  <div style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Main Artist</div>
                </div>
                <button style={{ background: 'transparent', border: '1px solid #b3b3b3', color: 'white', padding: '4px 12px', borderRadius: '500px', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Follow
                </button>
              </div>
            </div>

            <div style={{ background: '#242424', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>Your queue</div>
              <div style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Playing next</div>
            </div>
          </aside>
        )}
      </div>

      <Player />
      <FullScreenPlayer />

      {/* Mobile bottom nav — shown only on mobile via CSS */}
      <MobileNav />
    </BrowserRouter>
  );
}

export default App;

