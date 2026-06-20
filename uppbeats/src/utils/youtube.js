const BACKEND_URL = '/api';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchSongs = async (query, maxResults = 30) => {
  if (API_KEY) {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`);
      if (!res.ok) throw new Error('YouTube API failed');
      const data = await res.json();
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
      }));
    } catch (err) {
      console.error("YouTube API error, falling back to backend:", err);
    }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.slice(0, maxResults);
    }
    return [];
  } catch (err) {
    console.error("Search error via backend:", err);
    return [];
  }
};

export const getTopUsaSongs = async () => {
  if (API_KEY) {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent('top 50 hit songs usa playlist 2024')}&type=video&key=${API_KEY}`);
      if (!res.ok) throw new Error('YouTube API failed');
      const data = await res.json();
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
      }));
    } catch (err) {
      console.error("YouTube API error, falling back to backend:", err);
    }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/top-usa`);
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      return data.items;
    }
    return [];
  } catch (err) {
    console.error("Top USA songs error via backend:", err);
    return [];
  }
};

export const getTopIndiaSongs = async () => {
  if (API_KEY) {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent('top 50 hit songs india bollywood 2024')}&type=video&key=${API_KEY}`);
      if (!res.ok) throw new Error('YouTube API failed');
      const data = await res.json();
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
      }));
    } catch (err) {
      console.error("YouTube API error, falling back to backend:", err);
    }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/top-india`);
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      return data.items;
    }
    return [];
  } catch (err) {
    console.error("Top India songs error via backend:", err);
    return [];
  }
};

export const getPlaylistItems = async (query) => {
  return await searchSongs(query, 20);
};
