import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Bookmark, BookmarkCheck, Star, Calendar, Tv, Users, Download, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { MOCK_ANIME, generateEpisodes } from '../data/animeData';
import { useAnime } from '../context/AnimeContext';
import { useToast } from '../components/common/Toast';
import AnimeCard from '../components/anime/AnimeCard';
import './AnimeDetailPage.css';

export default function AnimeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const anime = MOCK_ANIME.find(a => a.id === Number(id));
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, startDownload } = useAnime();
  const { addToast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [showAllEps, setShowAllEps] = useState(false);

  if (!anime) return (
    <Layout title="Not Found">
      <div style={{textAlign:'center',padding:'80px',color:'var(--text-muted)'}}>Anime not found.</div>
    </Layout>
  );

  const episodes = generateEpisodes(anime.seasons[selectedSeason]?.episodes || 12);
  const displayEps = showAllEps ? episodes : episodes.slice(0, 12);
  const related = MOCK_ANIME.filter(a => a.id !== anime.id && a.genre.some(g => anime.genre.includes(g))).slice(0, 6);
  const inWl = isInWatchlist(anime.id);

  const handleWatchlist = () => {
    if (inWl) { removeFromWatchlist(anime.id); addToast('Removed from watchlist', 'default'); }
    else { addToWatchlist(anime); addToast('Added to watchlist!', 'success'); }
  };

  const handleDownload = (ep) => {
    startDownload(anime, ep);
    addToast(`Downloading Episode ${ep.number}...`, 'info');
  };

  return (
    <Layout title={anime.title}>
      <div className="detail-page page-enter">
        {/* Banner */}
        <div className="detail-banner">
          <img src={anime.banner} alt={anime.title} className="detail-banner-img" />
          <div className="detail-banner-overlay" />
          <div className="detail-banner-content">
            <div className="detail-cover">
              <img src={anime.cover} alt={anime.title} />
            </div>
            <div className="detail-info">
              <div className="detail-badges">
                {anime.new && <span className="badge badge-red">NEW</span>}
                {anime.trending && <span className="badge badge-orange">🔥 Trending</span>}
                <span className={`badge ${anime.status === 'Ongoing' ? 'badge-green' : 'badge-blue'}`}>{anime.status}</span>
              </div>
              <h1 className="detail-title">{anime.title}</h1>
              <p className="detail-title-jp">{anime.titleJP}</p>

              <div className="detail-stats">
                <div className="stat-item">
                  <Star size={14} fill="currentColor" color="#ffd700" />
                  <span className="stat-val">{anime.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-item">
                  <Tv size={14} color="var(--neon-blue)" />
                  <span className="stat-val">{anime.episodes}</span>
                  <span className="stat-label">Episodes</span>
                </div>
                <div className="stat-item">
                  <Calendar size={14} color="var(--neon-purple)" />
                  <span className="stat-val">{anime.year}</span>
                  <span className="stat-label">Year</span>
                </div>
                <div className="stat-item">
                  <Users size={14} color="var(--accent2)" />
                  <span className="stat-val">{anime.studio}</span>
                  <span className="stat-label">Studio</span>
                </div>
              </div>

              <div className="detail-genres">
                {anime.genre.map(g => <span key={g} className="tag">{g}</span>)}
              </div>

              <div className="detail-actions">
                <button className="btn btn-primary detail-play-btn" onClick={() => navigate(`/watch/${anime.id}/1`)}>
                  <Play size={18} fill="currentColor" /> Play Episode 1
                </button>
                <button className={`btn btn-ghost ${inWl ? 'wl-active' : ''}`} onClick={handleWatchlist}>
                  {inWl ? <><BookmarkCheck size={16} /> In Watchlist</> : <><Bookmark size={16} /> Add to Watchlist</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">
          {/* Synopsis */}
          <section className="detail-section">
            <h2 className="section-title">Synopsis</h2>
            <p className="detail-synopsis">{anime.description}</p>
          </section>

          {/* Episodes */}
          <section className="detail-section">
            <div className="eps-header">
              <h2 className="section-title">Episodes</h2>
              <div className="season-tabs">
                {anime.seasons.map((s, i) => (
                  <button key={s.id} className={`season-tab ${i === selectedSeason ? 'active' : ''}`} onClick={() => { setSelectedSeason(i); setShowAllEps(false); }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="episodes-grid">
              {displayEps.map(ep => (
                <div key={ep.id} className="episode-card" onClick={() => navigate(`/watch/${anime.id}/${ep.id}`)}>
                  <div className="ep-thumb">
                    <img src={`https://images.unsplash.com/photo-${1578632767115 + ep.id * 997}?w=320&h=180&fit=crop`} alt={ep.title} />
                    <div className="ep-play-overlay"><Play size={20} fill="white" /></div>
                    <span className="ep-num">EP {ep.number}</span>
                  </div>
                  <div className="ep-info">
                    <p className="ep-title">{ep.title}</p>
                    <div className="ep-meta">
                      <span className="ep-dur">{ep.duration}</span>
                      <button className="ep-dl-btn" onClick={e => { e.stopPropagation(); handleDownload(ep); }}>
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {episodes.length > 12 && (
              <button className="show-more-btn btn btn-ghost" onClick={() => setShowAllEps(!showAllEps)}>
                {showAllEps ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> Show All {episodes.length} Episodes</>}
              </button>
            )}
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="detail-section">
              <h2 className="section-title">You May Also Like</h2>
              <div className="anime-grid">{related.map(a => <AnimeCard key={a.id} anime={a} />)}</div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
