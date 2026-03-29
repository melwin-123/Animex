import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimeProvider } from './context/AnimeContext';
import { ToastProvider } from './components/common/Toast';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import WatchPage from './pages/WatchPage';
import { WatchlistPage, HistoryPage, DownloadsPage } from './pages/ListPages';
import { TrendingPage, TopRatedPage } from './pages/TrendingPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimeProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/top-rated" element={<TopRatedPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
              <Route path="/watch/:animeId/:episodeId" element={<WatchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AnimeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
