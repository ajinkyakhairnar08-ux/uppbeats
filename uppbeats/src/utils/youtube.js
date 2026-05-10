const BACKEND_URL = '/api';

export const searchSongs = async (query, maxResults = 30) => {
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
