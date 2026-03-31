import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { readJSON, userScopedKey, writeJSON } from '../utils/storage';

const AnimeContext = createContext(null);

const defaultPreferences = {
  quality: '1080p',
  language: 'English',
  autoPlay: true,
  skipIntro: false,
  subtitles: true,
  notifications: true,
  emailNotif: false,
  theme: 'midnight'
};

export const AnimeProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [downloadQueue, setDownloadQueue] = useState([]);

  useEffect(() => {
    if (!userId) {
      setWatchlist([]);
      setHistory([]);
      setDownloads([]);
      setRecentSearches([]);
      setPreferences(defaultPreferences);
      setDownloadQueue([]);
      return;
    }

    setWatchlist(readJSON(userScopedKey(userId, 'watchlist'), []));
    setHistory(readJSON(userScopedKey(userId, 'history'), []));
    setDownloads(readJSON(userScopedKey(userId, 'downloads'), []));
    setRecentSearches(readJSON(userScopedKey(userId, 'recent_searches'), []));
    setPreferences({ ...defaultPreferences, ...readJSON(userScopedKey(userId, 'preferences'), {}) });
    setDownloadQueue([]);
  }, [userId]);

  useEffect(() => {
    if (userId) writeJSON(userScopedKey(userId, 'watchlist'), watchlist);
  }, [userId, watchlist]);
  useEffect(() => {
    if (userId) writeJSON(userScopedKey(userId, 'history'), history);
  }, [userId, history]);
  useEffect(() => {
    if (userId) writeJSON(userScopedKey(userId, 'downloads'), downloads);
  }, [userId, downloads]);
  useEffect(() => {
    if (userId) writeJSON(userScopedKey(userId, 'recent_searches'), recentSearches);
  }, [userId, recentSearches]);
  useEffect(() => {
    if (userId) writeJSON(userScopedKey(userId, 'preferences'), preferences);
    document.body.dataset.theme = preferences.theme || 'midnight';
  }, [userId, preferences]);

  const addToWatchlist = (anime) => {
    setWatchlist((prev) => (prev.find((a) => a.id === anime.id) ? prev : [...prev, { ...anime, addedAt: new Date().toISOString() }]));
  };

  const removeFromWatchlist = (animeId) => {
    setWatchlist((prev) => prev.filter((a) => a.id !== animeId));
  };

  const isInWatchlist = (animeId) => watchlist.some((a) => a.id === animeId);

  const addToHistory = (anime, episode, explicitProgress) => {
    const fallbackExisting = history.find((h) => h.id === anime.id && h.episode?.id === episode?.id)?.progress ?? 0;
    const nextProgress = typeof explicitProgress === 'number' ? explicitProgress : Math.max(fallbackExisting, Math.floor(Math.random() * 35) + 8);
    const entry = {
      ...anime,
      episode,
      watchedAt: new Date().toISOString(),
      progress: Math.min(100, Math.max(0, Math.round(nextProgress)))
    };

    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.id === anime.id && h.episode?.id === episode?.id));
      return [entry, ...filtered].slice(0, 80);
    });
  };

  const updateWatchProgress = (anime, episode, progress) => {
    addToHistory(anime, episode, progress);
  };

  const clearHistory = () => setHistory([]);

  const continueWatching = useMemo(() => history.filter((item) => item.progress > 0 && item.progress < 100).slice(0, 6), [history]);
  const completedCount = useMemo(() => history.filter((item) => item.progress >= 95).length, [history]);
  const hoursWatched = useMemo(() => Math.round(history.reduce((sum, item) => sum + ((item.episode?.duration ? Number.parseInt(item.episode.duration, 10) || 24 : 24) * ((item.progress || 0) / 100)), 0) / 60), [history]);

  const saveRecentSearch = (query) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches((prev) => [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const updatePreferences = (updates) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const resetAllUserData = () => {
    setWatchlist([]);
    setHistory([]);
    setDownloads([]);
    setRecentSearches([]);
    setDownloadQueue([]);
    setPreferences(defaultPreferences);
  };

  const startDownload = (anime, episode) => {
    const dlId = `${anime.id}-${episode.id}`;
    if (downloadQueue.find((d) => d.id === dlId) || downloads.find((d) => d.id === dlId)) return;

    const dlItem = { id: dlId, anime, episode, progress: 0, status: 'downloading', startedAt: new Date().toISOString() };
    setDownloadQueue((prev) => [...prev, dlItem]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadQueue((prev) => prev.filter((d) => d.id !== dlId));
        setDownloads((prev) => [...prev, { ...dlItem, progress: 100, status: 'completed', completedAt: new Date().toISOString(), size: `${(Math.random() * 400 + 100).toFixed(0)} MB` }]);
      } else {
        setDownloadQueue((prev) => prev.map((d) => (d.id === dlId ? { ...d, progress } : d)));
      }
    }, 600);
  };

  const removeDownload = (dlId) => {
    setDownloads((prev) => prev.filter((d) => d.id !== dlId));
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    history,
    addToHistory,
    updateWatchProgress,
    clearHistory,
    continueWatching,
    downloads,
    downloadQueue,
    startDownload,
    removeDownload,
    recentSearches,
    saveRecentSearch,
    clearRecentSearches,
    preferences,
    updatePreferences,
    resetAllUserData,
    stats: {
      watchlistCount: watchlist.length,
      completedCount,
      hoursWatched,
      downloadsCount: downloads.length
    }
  };

  return <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>;
};

export const useAnime = () => useContext(AnimeContext);
