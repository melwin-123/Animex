import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Play, Trash2, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AnimeCard from '../components/anime/AnimeCard';
import { useAnime } from '../context/AnimeContext';
import { useToast } from '../components/common/Toast';
import './ListPages.css';

export function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useAnime();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRemove = (id, title) => {
    removeFromWatchlist(id);
    addToast(`Removed "${title}" from watchlist`, 'default');
  };

  return (
    <Layout title="Watchlist">
      <div className="list-page page-enter">
        <div className="list-page-header">
          <h1 className="list-title"><Bookmark size={22} /> My Watchlist</h1>
          <span className="list-count">{watchlist.length} anime</span>
        </div>

        {watchlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h3>Your watchlist is empty</h3>
            <p>Browse anime and add them to your watchlist</p>
            <button className="btn btn-primary" onClick={() => navigate('/search')}>Discover Anime</button>
          </div>
        ) : (
          <div className="anime-grid">
            {watchlist.map(anime => (
              <div key={anime.id} className="wl-card-wrap">
                <AnimeCard anime={anime} />
                <button className="wl-remove-btn" onClick={() => handleRemove(anime.id, anime.title)}>
                  <X size={14} />
                </button>
                <div className="wl-date">Added {new Date(anime.addedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export function HistoryPage() {
  const { history, clearHistory } = useAnime();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleClear = () => { clearHistory(); addToast('Watch history cleared', 'default'); };

  return (
    <Layout title="History">
      <div className="list-page page-enter">
        <div className="list-page-header">
          <h1 className="list-title">Watch History</h1>
          {history.length > 0 && (
            <button className="btn btn-ghost danger-btn" onClick={handleClear}>
              <Trash2 size={15} /> Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3>No watch history yet</h3>
            <p>Start watching anime and your history will appear here</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Anime</button>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, i) => (
              <div key={i} className="history-item glass">
                <img src={item.cover} alt={item.title} className="history-cover" />
                <div className="history-info">
                  <h4 className="history-title">{item.title}</h4>
                  <p className="history-ep">Episode {item.episode?.number}: {item.episode?.title}</p>
                  <div className="history-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${item.progress}%`}} /></div>
                    <span className="history-pct">{item.progress}%</span>
                  </div>
                  <span className="history-date">{new Date(item.watchedAt).toLocaleDateString('en-US', {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                </div>
                <button className="btn btn-primary history-resume-btn" onClick={() => navigate(`/watch/${item.id}/${item.episode?.id || 1}`)}>
                  <Play size={14} fill="currentColor" /> Resume
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export function DownloadsPage() {
  const { downloads, downloadQueue, removeDownload } = useAnime();
  const { addToast } = useToast();

  const handleDelete = (id, title) => {
    removeDownload(id);
    addToast(`Deleted download`, 'default');
  };

  return (
    <Layout title="Downloads">
      <div className="list-page page-enter">
        <div className="list-page-header">
          <h1 className="list-title">Downloads</h1>
          <span className="list-count">{downloads.length} completed · {downloadQueue.length} in progress</span>
        </div>

        {downloadQueue.length > 0 && (
          <section className="dl-section">
            <h3 className="dl-section-title">In Progress</h3>
            <div className="dl-list">
              {downloadQueue.map(dl => (
                <div key={dl.id} className="dl-item glass">
                  <img src={dl.anime.cover} alt={dl.anime.title} className="dl-cover" />
                  <div className="dl-info">
                    <p className="dl-title">{dl.anime.title}</p>
                    <p className="dl-ep">Episode {dl.episode.number}</p>
                    <div className="dl-progress-row">
                      <div className="progress-bar" style={{flex:1}}><div className="progress-fill" style={{width:`${dl.progress}%`}} /></div>
                      <span className="dl-pct">{dl.progress}%</span>
                    </div>
                    <span className="dl-status downloading">⬇ Downloading...</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {downloads.length > 0 && (
          <section className="dl-section">
            <h3 className="dl-section-title">Completed</h3>
            <div className="dl-list">
              {downloads.map(dl => (
                <div key={dl.id} className="dl-item glass">
                  <img src={dl.anime.cover} alt={dl.anime.title} className="dl-cover" />
                  <div className="dl-info">
                    <p className="dl-title">{dl.anime.title}</p>
                    <p className="dl-ep">Episode {dl.episode.number}</p>
                    <div className="dl-meta">
                      <span className="dl-size">{dl.size}</span>
                      <span className="dl-status done">✓ Ready</span>
                    </div>
                  </div>
                  <div className="dl-actions">
                    <button className="btn btn-primary dl-play-btn" style={{fontSize:'0.8rem',padding:'8px 14px'}}>
                      <Play size={13} fill="currentColor" /> Play
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(dl.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {downloads.length === 0 && downloadQueue.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">⬇</div>
            <h3>No downloads yet</h3>
            <p>Download episodes to watch offline anytime</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
