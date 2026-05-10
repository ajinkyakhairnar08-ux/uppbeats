import { create } from 'zustand';

export const useStore = create((set) => ({
  currentSong: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 100,
  isShuffle: false,
  isLoop: false,
  isFullScreen: false,
  currentTime: 0,
  duration: 0,
  seekToTime: null,
  customPlaylists: JSON.parse(localStorage.getItem('uppbeats_playlists')) || [],
  
  setCurrentSong: (song, list = null) => set((state) => {
    const newPlaylist = list || state.playlist;
    const index = newPlaylist.findIndex(s => s.id === song.id);
    return { 
      currentSong: song, 
      playlist: newPlaylist,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true 
    };
  }),
  setPlaylist: (list) => set({ playlist: list }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (vol) => set({ volume: vol }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleLoop: () => set((state) => ({ isLoop: !state.isLoop })),
  setIsFullScreen: (val) => set({ isFullScreen: val }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (time) => set({ duration: time }),
  setSeekToTime: (time) => set({ seekToTime: time }),
  
  nextSong: () => set((state) => {
    if (state.playlist.length === 0) return state;
    if (state.isLoop && state.currentSong) return { isPlaying: true, seekToTime: 0 };
    let nextIndex;
    if (state.isShuffle) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      nextIndex = (state.currentIndex + 1) % state.playlist.length;
    }
    return { currentIndex: nextIndex, currentSong: state.playlist[nextIndex], isPlaying: true };
  }),
  
  prevSong: () => set((state) => {
    if (state.playlist.length === 0) return state;
    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) prevIndex = state.playlist.length - 1;
    return { currentIndex: prevIndex, currentSong: state.playlist[prevIndex], isPlaying: true };
  }),

  createCustomPlaylist: (name) => set((state) => {
    const newPlaylists = [...state.customPlaylists, { id: Date.now(), name, songs: [] }];
    localStorage.setItem('uppbeats_playlists', JSON.stringify(newPlaylists));
    return { customPlaylists: newPlaylists };
  }),

  addToCustomPlaylist: (playlistId, song) => set((state) => {
    const newPlaylists = state.customPlaylists.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.songs.find(s => s.id === song.id)) {
          return { ...pl, songs: [...pl.songs, song] };
        }
      }
      return pl;
    });
    localStorage.setItem('uppbeats_playlists', JSON.stringify(newPlaylists));
    return { customPlaylists: newPlaylists };
  })
}));
