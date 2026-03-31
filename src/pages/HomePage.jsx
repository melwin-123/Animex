import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight, Star, Flame, Sparkles, Clock3, Trophy, Download } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AnimeCard from '../components/anime/AnimeCard';
import { MOCK_ANIME } from '../data/animeData';
import { useAnime } from '../context/AnimeContext';
import './HomePage.css';

const HERO_ANIME = MOCK_ANIME.filter((a) => a.trending).slice(0, 5);

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const navigate = useNavigate();
  const { addToWatchlist, isInWatchlist, continueWatching, stats } = useAnime();

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_ANIME.length), 6000);
    return () => clearInterval(t);
  }, []);

  const hero = HERO_ANIME[heroIdx];
  const trending = useMemo(() => MOCK_ANIME.filter((a) => a.trending), []);
  const newEpisodes = useMemo(() => MOCK_ANIME.filter((a) => a.new), []);
  const topRated = useMemo(() => [...MOCK_ANIME].sort((a, b) => b.rating - a.rating).slice(0, 8), []);
  const completed = useMemo(() => MOCK_ANIME.filter((a) => a.status === 'Completed'), []);

  return (
    <Layout title="Home">
      <div className="hero-section">
        <div className="hero-bg">
          {HERO_ANIME.map((a, i) => (
            <div key={a.id} className={`hero-bg-img ${i === heroIdx ? 'active' : ''}`} style={{ backgroundImage: `url(${a.banner})` }} />
          ))}
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge badge-red">🔥 TRENDING</span>
            <span className="badge badge-orange">#{heroIdx + 1} THIS WEEK</span>
          </div>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-title-jp">{hero.titleJP}</p>
          <div className="hero-meta">
            <span className="rating"><Star size={14} fill="currentColor" />{hero.rating}</span>
            <span className="hero-year">{hero.year}</span>
            <span className="hero-studio">{hero.studio}</span>
            <span className={`badge ${hero.status === 'Ongoing' ? 'badge-green' : 'badge-blue'}`}>{hero.status}</span>
          </div>
          <p className="hero-desc">{hero.description.slice(0, 170)}...</p>
          <div className="hero-actions">
            <button className="btn btn-primary hero-play-btn" onClick={() => navigate(`/watch/${hero.id}/1`)}>
              <Play size={18} fill="currentColor" /> Watch Now
            </button>
            <button className="btn btn-ghost" onClick={() => navigate(`/anime/${hero.id}`)}>
              <Info size={18} /> More Info
            </button>
            {!isInWatchlist(hero.id) && (
              <button className="btn btn-ghost" onClick={() => addToWatchlist(hero)}>
                + Watchlist
              </button>
            )}
          </div>
        </div>

        <div className="hero-dots">
          {HERO_ANIME.map((_, i) => (
            <button key={i} className={`hero-dot ${i === heroIdx ? 'active' : ''}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>

        <button className="hero-nav prev" onClick={() => setHeroIdx((i) => (i - 1 + HERO_ANIME.length) % HERO_ANIME.length)}>
          <ChevronLeft size={20} />
        </button>
        <button className="hero-nav next" onClick={() => setHeroIdx((i) => (i + 1) % HERO_ANIME.length)}>
          <ChevronRight size={20} />
        </button>

        <div className="hero-thumbs">
          {HERO_ANIME.map((a, i) => (
            <div key={a.id} className={`hero-thumb ${i === heroIdx ? 'active' : ''}`} onClick={() => setHeroIdx(i)}>
              <img src={a.cover} alt={a.title} />
              {i === heroIdx && <div className="hero-thumb-active-bar" />}
            </div>
          ))}
        </div>
      </div>

      <div className="home-sections">
        <section className="anime-section">
          <div className="section-header">
            <h2 className="section-title"><Trophy size={16} /> Your AnimeX Snapshot</h2>
          </div>
          <div className="animex-stats-grid">
            <div className="animex-stat-card glass"><span>{stats.watchlistCount}</span><p>Watchlist titles</p></div>
            <div className="animex-stat-card glass"><span>{stats.hoursWatched}h</span><p>Total watched</p></div>
            <div className="animex-stat-card glass"><span>{stats.completedCount}</span><p>Completed episodes</p></div>
            <div className="animex-stat-card glass"><span>{stats.downloadsCount}</span><p>Offline downloads</p></div>
          </div>
        </section>

        {continueWatching.length > 0 && (
          <section className="anime-section">
            <div className="section-header">
              <h2 className="section-title"><Clock3 size={16} /> Continue Watching</h2>
            </div>
            <div className="continue-grid">
              {continueWatching.map((item) => (
                <button key={`${item.id}-${item.episode?.id}`} className="continue-card glass" onClick={() => navigate(`/watch/${item.id}/${item.episode?.id || 1}`)}>
                  <img src={item.banner || item.cover} alt={item.title} />
                  <div className="continue-info">
                    <strong>{item.title}</strong>
                    <span>Episode {item.episode?.number}: {item.episode?.title}</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${item.progress}%` }} /></div>
                    <small>{item.progress}% watched</small>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <AnimeSection title="Trending Now" icon={<Flame size={16} />} items={trending} />
        <AnimeSection title="New Episodes" icon={<Sparkles size={16} />} items={newEpisodes} badge="NEW" />
        <AnimeSection title="Top Rated" icon={<Star size={16} />} items={topRated} />
        <AnimeSection title="Completed Series" icon={<Download size={16} />} items={completed} />
      </div>
    </Layout>
  );
}

function AnimeSection({ title, icon, items, badge }) {
  const navigate = useNavigate();
  return (
    <section className="anime-section">
      <div className="section-header">
        <h2 className="section-title">
          {icon} {title}
          {badge && <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>{badge}</span>}
        </h2>
        <button className="btn-ghost btn see-all-btn" onClick={() => navigate('/search')}>See All →</button>
      </div>
      <div className="anime-grid">{items.map((a) => <AnimeCard key={a.id} anime={a} />)}</div>
    </section>
  );
}
