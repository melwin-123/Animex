import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAnime } from '../../context/AnimeContext';
import './Header.css';

export default function Header({ title }) {
  const [searchVal, setSearchVal] = useState('');
  const { user } = useAuth();
  const { downloadQueue } = useAnime();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  return (
    <header className="header">
      <div className="header-title">{title}</div>

      <form className="header-search" onSubmit={handleSearch}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search anime..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          className="header-search-input"
        />
      </form>

      <div className="header-actions">
        {downloadQueue.length > 0 && (
          <div className="dl-indicator" onClick={() => navigate('/downloads')}>
            <div className="dl-spinner" />
            <span>{downloadQueue.length} downloading</span>
          </div>
        )}
        <button className="btn-icon notif-btn" onClick={() => navigate('/settings')}>
          <Bell size={18} />
        </button>
        {user && (
          <img
            src={user.avatar}
            alt={user.username}
            className="header-avatar"
            onClick={() => navigate('/settings')}
          />
        )}
      </div>
    </header>
  );
}
