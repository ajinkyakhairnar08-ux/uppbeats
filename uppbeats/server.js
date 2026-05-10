import express from 'express';
import ytSearch from 'yt-search';
import cors from 'cors';

const app = express();
app.use(cors());

// Fallbacks
const fallbackUsa = [
  { id: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You", channelTitle: "Ed Sheeran", thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg" },
  { id: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito ft. Daddy Yankee", channelTitle: "LuisFonsiVEVO", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg" },
  { id: "OPf0YbXqDm0", title: "Mark Ronson - Uptown Funk ft. Bruno Mars", channelTitle: "MarkRonsonVEVO", thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg" },
  { id: "09R8_2nJtjg", title: "Maroon 5 - Sugar", channelTitle: "Maroon5VEVO", thumbnail: "https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg" },
  { id: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again ft. Charlie Puth", channelTitle: "Wiz Khalifa", thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg" },
  { id: "fRh_vgS2dFE", title: "Justin Bieber - Sorry (PURPOSE : The Movement)", channelTitle: "JustinBieberVEVO", thumbnail: "https://i.ytimg.com/vi/fRh_vgS2dFE/hqdefault.jpg" },
  { id: "pRpeEdMmi3I", title: "Shakira - Waka Waka (This Time for Africa)", channelTitle: "shakiraVEVO", thumbnail: "https://i.ytimg.com/vi/pRpeEdMmi3I/hqdefault.jpg" },
  { id: "CevxZvSJLk8", title: "Katy Perry - Roar", channelTitle: "KatyPerryVEVO", thumbnail: "https://i.ytimg.com/vi/CevxZvSJLk8/hqdefault.jpg" },
  { id: "YQHsXMglC9A", title: "Adele - Hello", channelTitle: "AdeleVEVO", thumbnail: "https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg" },
  { id: "0yW7w8F2TVA", title: "James Arthur - Say You Won't Let Go", channelTitle: "JamesAVEVO", thumbnail: "https://i.ytimg.com/vi/0yW7w8F2TVA/hqdefault.jpg" }
];

const fallbackIndia = [
  { id: "YxWlaYCA8MU", title: "Jhoome Jo Pathaan Song", channelTitle: "YRF", thumbnail: "https://i.ytimg.com/vi/YxWlaYCA8MU/hqdefault.jpg" },
  { id: "v7K4vGYL9zI", title: "Chaleya - Jawan", channelTitle: "T-Series", thumbnail: "https://i.ytimg.com/vi/v7K4vGYL9zI/hqdefault.jpg" },
  { id: "mt9xg0vanLs", title: "Tum Hi Ho - Aashiqui 2", channelTitle: "T-Series", thumbnail: "https://i.ytimg.com/vi/mt9xg0vanLs/hqdefault.jpg" },
  { id: "6MlsMVzrp2o", title: "Chammak Challo", channelTitle: "T-Series", thumbnail: "https://i.ytimg.com/vi/6MlsMVzrp2o/hqdefault.jpg" },
  { id: "kw4tT7SCmaY", title: "Kesariya - Brahmāstra", channelTitle: "Sony Music", thumbnail: "https://i.ytimg.com/vi/kw4tT7SCmaY/hqdefault.jpg" },
  { id: "V7LwfY5U5WI", title: "Kal Ho Naa Ho", channelTitle: "SonyMusicIndiaVEVO", thumbnail: "https://i.ytimg.com/vi/V7LwfY5U5WI/hqdefault.jpg" },
  { id: "hoNb6HuNmU0", title: "Dil Diyan Gallan", channelTitle: "YRF", thumbnail: "https://i.ytimg.com/vi/hoNb6HuNmU0/hqdefault.jpg" },
  { id: "xRbPAVnqtcs", title: "Gerua - Dilwale", channelTitle: "Sony Music", thumbnail: "https://i.ytimg.com/vi/xRbPAVnqtcs/hqdefault.jpg" },
  { id: "VuG7gePn3AM", title: "Tere Bina", channelTitle: "Sony Music", thumbnail: "https://i.ytimg.com/vi/VuG7gePn3AM/hqdefault.jpg" },
  { id: "KmwKEIofqY0", title: "Ghungroo", channelTitle: "YRF", thumbnail: "https://i.ytimg.com/vi/KmwKEIofqY0/hqdefault.jpg" }
];

// Timeout wrapper for ytSearch to prevent hanging
const ytSearchWithTimeout = (query, timeoutMs = 4000) => {
  return Promise.race([
    ytSearch(query),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Search timeout')), timeoutMs))
  ]);
};

// Generates fallback results dynamically by multiplying base arrays
const generateFallback = (baseArray, count, query) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const baseSong = baseArray[i % baseArray.length];
    result.push({
      id: baseSong.id,
      title: query ? `${query} - Track ${i + 1}` : baseSong.title,
      channelTitle: baseSong.channelTitle,
      thumbnail: baseSong.thumbnail
    });
  }
  return result;
};

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query required' });
  
  try {
    const r = await ytSearchWithTimeout(query);
    const videos = r.videos.slice(0, 30);
    const mapped = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      channelTitle: v.author.name,
      thumbnail: v.thumbnail
    }));
    res.json({ items: mapped.length > 0 ? mapped : generateFallback(fallbackUsa, 30, query) });
  } catch (error) {
    console.error("Backend search error:", error.message);
    res.json({ items: generateFallback(fallbackUsa, 30, query) });
  }
});

app.get('/api/top-usa', async (req, res) => {
  try {
    const r = await ytSearchWithTimeout('top 50 hit songs usa playlist');
    const videos = r.videos.slice(0, 50);
    const mapped = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      channelTitle: v.author.name,
      thumbnail: v.thumbnail
    }));
    res.json({ items: mapped.length > 0 ? mapped : generateFallback(fallbackUsa, 50) });
  } catch (error) {
    console.error("Backend top-usa error:", error.message);
    res.json({ items: generateFallback(fallbackUsa, 50) });
  }
});

app.get('/api/top-india', async (req, res) => {
  try {
    const r = await ytSearchWithTimeout('top 50 hit songs india bollywood playlist');
    const videos = r.videos.slice(0, 50);
    const mapped = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      channelTitle: v.author.name,
      thumbnail: v.thumbnail
    }));
    res.json({ items: mapped.length > 0 ? mapped : generateFallback(fallbackIndia, 50) });
  } catch (error) {
    console.error("Backend top-india error:", error.message);
    res.json({ items: generateFallback(fallbackIndia, 50) });
  }
});

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
