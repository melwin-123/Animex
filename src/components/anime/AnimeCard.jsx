import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Bookmark, BookmarkCheck, Play } from 'lucide-react';
import { useAnime } from '../../context/AnimeContext';
import './AnimeCard.css';

export default function AnimeCard({ anime, size = 'md' }) {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useAnime();
  const inWatchlist = isInWatchlist(anime.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    inWatchlist ? removeFromWatchlist(anime.id) : addToWatchlist(anime);
  };

  return (
    <div className={`anime-card card-${size}`} onClick={() => navigate(`/anime/${anime.id}`)}>
      <div className="card-img-wrap">
        <img src={anime.cover} alt={anime.title} loading="lazy" />
        <div className="card-overlay" />

        <div className="card-badges">
          {anime.new && <span className="badge badge-red">NEW</span>}
          {anime.trending && <span className="badge badge-orange">🔥</span>}
        </div>

        <div className="card-hover-overlay">
          <button className="play-btn">
            <Play size={22} fill="currentColor" />
          </button>
          <div className="card-genres">
            {anime.genre.slice(0, 2).map(g => <span key={g} className="tag">{g}</span>)}
          </div>
        </div>

        <button className={`card-watchlist-btn ${inWatchlist ? 'active' : ''}`} onClick={handleWatchlist}>
          {inWatchlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
        </button>
      </div>

      <div className="card-info">
        <p className="card-title">{anime.title}</p>
        <div className="card-meta">
          <span className="rating"><Star size={11} fill="currentColor" />{anime.rating}</span>
          <span className="card-ep">{anime.episodes} ep</span>
          <span className={`status-dot ${anime.status === 'Ongoing' ? 'ongoing' : 'done'}`} />
        </div>
      </div>
    </div>
  );
}
