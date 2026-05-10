import ytSearch from 'yt-search';

const fallback = [
  { id: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You", channelTitle: "Ed Sheeran", thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg" },
  { id: "kJQP7kiw5Fk", title: "Luis Fonsi - Despacito", channelTitle: "LuisFonsiVEVO", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg" },
  { id: "OPf0YbXqDm0", title: "Uptown Funk - Bruno Mars", channelTitle: "MarkRonsonVEVO", thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg" },
  { id: "09R8_2nJtjg", title: "Maroon 5 - Sugar", channelTitle: "Maroon5VEVO", thumbnail: "https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg" },
  { id: "RgKAFK5djSk", title: "Wiz Khalifa - See You Again", channelTitle: "Wiz Khalifa", thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg" },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    const r = await Promise.race([
      ytSearch(query),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
    ]);
    const videos = r.videos.slice(0, 30);
    const mapped = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      channelTitle: v.author.name,
      thumbnail: v.thumbnail
    }));
    res.json({ items: mapped.length > 0 ? mapped : fallback });
  } catch (err) {
    res.json({ items: fallback });
  }
}
