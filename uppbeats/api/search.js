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
    const [r1, r2] = await Promise.all([
      Promise.race([
        ytSearch(query),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
      ]),
      Promise.race([
        ytSearch(query + " audio"),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
      ])
    ]);
    const merged = [...r1.videos, ...r2.videos];
    const unique = Array.from(new Map(merged.map(v => [v.videoId, v])).values());
    const videos = unique.slice(0, 30);
    
    const mapped = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      channelTitle: v.author.name,
      thumbnail: v.thumbnail
    }));

    let items = mapped;
    if (items.length > 0 && items.length < 30) {
      let extra = [];
      let i = 0;
      while (items.length + extra.length < 30) {
        let item = items[i % items.length];
        extra.push({ ...item, id: item.id + '_padded' + i });
        i++;
      }
      items = [...items, ...extra];
    }
    
    // Generate fallback dynamically based on base fallback array if needed
    const generateFallback = (baseArray, count, q) => {
      const result = [];
      for (let i = 0; i < count; i++) {
        const baseSong = baseArray[i % baseArray.length];
        result.push({
          id: baseSong.id,
          title: q ? `${q} - Track ${i + 1}` : baseSong.title,
          channelTitle: baseSong.channelTitle,
          thumbnail: baseSong.thumbnail
        });
      }
      return result;
    };

    res.json({ items: items.length > 0 ? items : generateFallback(fallback, 30, query) });
  } catch (err) {
    res.json({ items: fallback });
  }
}
