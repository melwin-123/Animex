import React from 'react';
import { Flame, Star, Trophy } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AnimeCard from '../components/anime/AnimeCard';
import { MOCK_ANIME } from '../data/animeData';
import './TrendingPage.css';

export function TrendingPage() {
  const trending = MOCK_ANIME.filter(a => a.trending);
  const newEps = MOCK_ANIME.filter(a => a.new);

  return (
    <Layout title="Trending">
      <div className="trending-page page-enter">
        <div className="trending-hero-banner">
          <div className="thb-bg" />
          <div className="thb-content">
            <Flame size={36} color="var(--accent2)" />
            <h1 className="thb-title">What's Hot</h1>
            <p className="thb-sub">The most watched anime right now</p>
          </div>
        </div>

        <section className="t-section">
          <h2 className="section-title"><Flame size={16}/> Trending This Week</h2>
          <div className="anime-grid">{trending.map(a => <AnimeCard key={a.id} anime={a} />)}</div>
        </section>

        <section className="t-section">
          <h2 className="section-title">✨ New Episodes Out Now</h2>
          <div className="anime-grid">{newEps.map(a => <AnimeCard key={a.id} anime={a} />)}</div>
        </section>
      </div>
    </Layout>
  );
}

export function TopRatedPage() {
  const sorted = [...MOCK_ANIME].sort((a, b) => b.rating - a.rating);

  return (
    <Layout title="Top Rated">
      <div className="trending-page page-enter">
        <div className="trending-hero-banner top-rated-banner">
          <div className="thb-bg tr-bg" />
          <div className="thb-content">
            <Trophy size={36} color="#ffd700" />
            <h1 className="thb-title">Hall of Fame</h1>
            <p className="thb-sub">The highest rated anime of all time</p>
          </div>
        </div>

        <div className="top-rated-list">
          {sorted.map((anime, i) => (
            <div key={anime.id} className="tr-item glass">
              <span className={`tr-rank ${i < 3 ? 'top3' : ''}`}>#{i + 1}</span>
              <img src={anime.cover} alt={anime.title} className="tr-cover" />
              <div className="tr-info">
                <h4 className="tr-title">{anime.title}</h4>
                <p className="tr-meta">{anime.year} · {anime.studio} · {anime.episodes} ep</p>
                <div className="tr-genres">{anime.genre.slice(0,3).map(g=><span key={g} className="tag">{g}</span>)}</div>
              </div>
              <div className="tr-rating">
                <Star size={18} fill="#ffd700" color="#ffd700" />
                <span className="tr-score">{anime.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
