import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Bookmark, Clock, Download, Settings, LogOut, ChevronLeft, ChevronRight, Star, Flame, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAnime } from '../../context/AnimeContext';
import './Sidebar.css';

const NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Discover' },
  { to: '/trending', icon: Flame, label: 'Trending' },
  { to: '/top-rated', icon: Star, label: 'Top Rated' },
  { to: '/watchlist', icon: Bookmark, label: 'Watchlist' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/downloads', icon: Download, label: 'Downloads' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true); // start closed (better for mobile)
  const sidebarRef = useRef(null);

  const { user, logout } = useAuth();
  const { watchlist, downloadQueue } = useAnime();
  const navigate = useNavigate();

  // 🔥 Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* 🔥 Overlay */}
      {!collapsed && (
        <div
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* 🔥 Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-x">ANIME</span>
              <span className="logo-accent">X</span>
            </div>
          )}
          {collapsed && <span className="logo-accent logo-icon-only">X</span>}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* User */}
        {user && (
          <div
            className="sidebar-user"
            onClick={() => {
              navigate('/settings');
              setCollapsed(true); // close after click
            }}
          >
            <img src={user.avatar} alt={user.username} className="user-avatar" />
            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span
                  className={`user-plan ${
                    user.plan === 'Premium' ? 'premium' : 'free'
                  }`}
                >
                  {user.plan === 'Premium' && <Crown size={10} />} {user.plan}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setCollapsed(true)} // 🔥 auto close on click
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <div className="nav-icon-wrap">
                <Icon size={18} />
                {label === 'Watchlist' && watchlist.length > 0 && (
                  <span className="nav-badge">{watchlist.length}</span>
                )}
                {label === 'Downloads' && downloadQueue.length > 0 && (
                  <span className="nav-badge pulse">
                    {downloadQueue.length}
                  </span>
                )}
              </div>
              {!collapsed && <span className="nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          className="sidebar-logout"
          onClick={() => {
            handleLogout();
            setCollapsed(true);
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </aside>
    </>
  );
}