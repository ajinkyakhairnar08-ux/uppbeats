import ytSearch from 'yt-search';

const fallbackIndia = [
  { id: "YxWlaYCA8MU", title: "Jhoome Jo Pathaan Song", channelTitle: "YRF", thumbnail: "https://i.ytimg.com/vi/YxWlaYCA8MU/hqdefault.jpg" },
  { id: "v7K4vGYL9zI", title: "Chaleya - Jawan", channelTitle: "T-Series", thumbnail: "https://i.ytimg.com/vi/v7K4vGYL9zI/hqdefault.jpg" },
  { id: "mt9xg0vanLs", title: "Tum Hi Ho - Aashiqui 2", channelTitle: "T-Series", thumbnail: "https://i.ytimg.com/vi/mt9xg0vanLs/hqdefault.jpg" },
  { id: "kw4tT7SCmaY", title: "Kesariya - Brahmāstra", channelTitle: "Sony Music", thumbnail: "https://i.ytimg.com/vi/kw4tT7SCmaY/hqdefault.jpg" },
  { id: "hoNb6HuNmU0", title: "Dil Diyan Gallan", channelTitle: "YRF", thumbnail: "https://i.ytimg.com/vi/hoNb6HuNmU0/hqdefault.jpg" },
  { id: "xRbPAVnqtcs", title: "Gerua - Dilwale", channelTitle: "Sony Music", thumbnail: "https://i.ytimg.com/vi/xRbPAVnqtcs/hqdefault.jpg" },
  { id: "KmwKEIofqY0", title: "Ghungroo", channelTitle: "YRF", thumbnail: "https://i.ytimg.com/vi/KmwKEIofqY0/hqdefault.jpg" },
  { id: "6MlsMVzrp2o", title: "Chammak Challo", channelTitle: "T-Series", thumbnail: "https://i.ytimg.com/vi/6MlsMVzrp2o/hqdefault.jpg" },
  { id: "V7LwfY5U5WI", title: "Kal Ho Naa Ho", channelTitle: "SonyMusicIndiaVEVO", thumbnail: "https://i.ytimg.com/vi/V7LwfY5U5WI/hqdefault.jpg" },
  { id: "VuG7gePn3AM", title: "Tere Bina", channelTitle: "Sony Music", thumbnail: "https://i.ytimg.com/vi/VuG7gePn3AM/hqdefault.jpg" },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const r = await Promise.race([
      ytSearch('top 50 hit songs india bollywood 2024'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
    ]);
    const videos = r.videos.slice(0, 50);
    const mapped = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      channelTitle: v.author.name,
      thumbnail: v.thumbnail
    }));
    res.json({ items: mapped.length > 0 ? mapped : fallbackIndia });
  } catch (err) {
    res.json({ items: fallbackIndia });
  }
}
