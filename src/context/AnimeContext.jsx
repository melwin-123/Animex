import React, { createContext, useContext, useState, useEffect } from 'react';

const AnimeContext = createContext(null);

export const AnimeProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('animex_watchlist') || '[]'); } catch { return []; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('animex_history') || '[]'); } catch { return []; }
  });
  const [downloads, setDownloads] = useState(() => {
    try { return JSON.parse(localStorage.getItem('animex_downloads') || '[]'); } catch { return []; }
  });
  const [downloadQueue, setDownloadQueue] = useState([]);

  useEffect(() => { localStorage.setItem('animex_watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('animex_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('animex_downloads', JSON.stringify(downloads)); }, [downloads]);

  const addToWatchlist = (anime) => {
    setWatchlist(prev => prev.find(a => a.id === anime.id) ? prev : [...prev, { ...anime, addedAt: new Date().toISOString() }]);
  };

  const removeFromWatchlist = (animeId) => {
    setWatchlist(prev => prev.filter(a => a.id !== animeId));
  };

  const isInWatchlist = (animeId) => watchlist.some(a => a.id === animeId);

  const addToHistory = (anime, episode) => {
    const entry = { ...anime, episode, watchedAt: new Date().toISOString(), progress: Math.floor(Math.random() * 100) };
    setHistory(prev => {
      const filtered = prev.filter(h => !(h.id === anime.id && h.episode?.id === episode?.id));
      return [entry, ...filtered].slice(0, 50);
    });
  };

  const clearHistory = () => setHistory([]);

  const startDownload = (anime, episode) => {
    const dlId = `${anime.id}-${episode.id}`;
    if (downloadQueue.find(d => d.id === dlId) || downloads.find(d => d.id === dlId)) return;
    
    const dlItem = { id: dlId, anime, episode, progress: 0, status: 'downloading', startedAt: new Date().toISOString() };
    setDownloadQueue(prev => [...prev, dlItem]);

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadQueue(prev => prev.filter(d => d.id !== dlId));
        setDownloads(prev => [...prev, { ...dlItem, progress: 100, status: 'completed', completedAt: new Date().toISOString(), size: `${(Math.random() * 400 + 100).toFixed(0)} MB` }]);
      } else {
        setDownloadQueue(prev => prev.map(d => d.id === dlId ? { ...d, progress } : d));
      }
    }, 600);
  };

  const removeDownload = (dlId) => {
    setDownloads(prev => prev.filter(d => d.id !== dlId));
  };

  return (
    <AnimeContext.Provider value={{
      watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist,
      history, addToHistory, clearHistory,
      downloads, downloadQueue, startDownload, removeDownload
    }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => useContext(AnimeContext);
