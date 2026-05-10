fetch('https://api.allorigins.win/raw?url=https://www.youtube.com/results?search_query=eminem')
  .then(res => res.text())
  .then(html => {
    const matches = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
    console.log(matches ? matches.slice(0, 5) : 'no matches');
  })
  .catch(console.error);
