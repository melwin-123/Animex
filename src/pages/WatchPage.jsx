import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Settings, ChevronLeft, Download, List
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { MOCK_ANIME, generateEpisodes } from '../data/animeData';
import { useAnime } from '../context/AnimeContext';
import { useToast } from '../components/common/Toast';
import './WatchPage.css';

export default function WatchPage() {
  const { animeId, episodeId } = useParams();
  const navigate = useNavigate();
  const anime = MOCK_ANIME.find(a => a.id === Number(animeId));
  const { addToHistory, startDownload } = useAnime();
  const { addToast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration] = useState(1440); // 24 minutes
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showEpList, setShowEpList] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const controlsTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const playerRef = useRef(null);

  const episodes = generateEpisodes(anime?.episodes || 12);
  const currentEp = episodes.find(e => e.id === Number(episodeId)) || episodes[0];
  const epIndex = episodes.findIndex(e => e.id === currentEp.id);

  useEffect(() => {
    if (anime && currentEp) addToHistory(anime, currentEp);
  }, [animeId, episodeId]);

  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setIsPlaying(false); return 100; }
          return p + (100 / duration) * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(progressTimerRef.current);
  }, [isPlaying, duration, playbackSpeed]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const formatTime = (secs) => {
    const s = Math.floor((secs / 100) * duration);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  const totalTime = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;

  const handleDownload = () => { startDownload(anime, currentEp); addToast(`Downloading Ep ${currentEp.number}...`, 'info'); };

  const goEp = (dir) => {
    const next = episodes[epIndex + dir];
    if (next) { setProgress(0); setIsPlaying(false); navigate(`/watch/${animeId}/${next.id}`); }
  };

  if (!anime) return <Layout title="Watch"><div style={{padding:40,color:'var(--text-muted)'}}>Anime not found.</div></Layout>;

  return (
    <Layout title={`${anime.title} - EP ${currentEp.number}`}>
      <div className="watch-page page-enter">
        <div className="watch-layout">
          {/* Player */}
          <div className="player-container" ref={playerRef}>
            <div
              className={`video-player ${showControls ? 'controls-visible' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {/* Fake video bg */}
              <div className="fake-video">
                <img
                  src={`https://images.unsplash.com/photo-${1578632767115 + currentEp.id * 997}?w=1280&h=720&fit=crop`}
                  alt="anime scene"
                  className="fake-video-img"
                />
                <div className="fake-video-overlay" />
              </div>

              {/* Center play */}
              {!isPlaying && (
                <div className="center-play">
                  <div className="center-play-btn" onClick={() => setIsPlaying(true)}>
                    <Play size={32} fill="white" />
                  </div>
                </div>
              )}

              {/* Top bar */}
              <div className="player-top-bar">
                <button className="player-back-btn" onClick={() => navigate(`/anime/${animeId}`)}>
                  <ChevronLeft size={18} /> <span>{anime.title}</span>
                </button>
                <div className="player-ep-title">
                  <span className="ep-badge">EP {currentEp.number}</span>
                  <span>{currentEp.title}</span>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="player-controls" onClick={e => e.stopPropagation()}>
                {/* Progress */}
                <div className="progress-track" onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}>
                  <div className="progress-fill-bar" style={{ width: `${progress}%` }} />
                  <div className="progress-thumb" style={{ left: `${progress}%` }} />
                </div>

                <div className="controls-row">
                  <div className="controls-left">
                    <button className="ctrl-btn" onClick={() => goEp(-1)} disabled={epIndex === 0}>
                      <SkipBack size={18} />
                    </button>
                    <button className="ctrl-btn play-pause-btn" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button className="ctrl-btn" onClick={() => goEp(1)} disabled={epIndex === episodes.length - 1}>
                      <SkipForward size={18} />
                    </button>

                    <div className="volume-ctrl">
                      <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)}>
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <input
                        type="range" min="0" max="100" value={isMuted ? 0 : volume}
                        className="volume-slider"
                        onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                      />
                    </div>

                    <span className="time-display">{formatTime(progress)} / {totalTime}</span>
                  </div>

                  <div className="controls-right">
                    <button className="ctrl-btn quality-btn" onClick={() => setShowSettings(!showSettings)}>
                      {quality}
                    </button>
                    <button className="ctrl-btn" onClick={() => setShowEpList(!showEpList)}>
                      <List size={18} />
                    </button>
                    <button className="ctrl-btn" onClick={handleDownload}>
                      <Download size={18} />
                    </button>
                    <button className="ctrl-btn" onClick={() => setIsFullscreen(!isFullscreen)}>
                      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Settings panel */}
              {showSettings && (
                <div className="settings-panel glass" onClick={e => e.stopPropagation()}>
                  <h4 className="sp-title">Playback Settings</h4>
                  <div className="sp-row">
                    <span>Quality</span>
                    <div className="sp-options">
                      {['360p','480p','720p','1080p'].map(q => (
                        <button key={q} className={`sp-opt ${quality === q ? 'active' : ''}`} onClick={() => { setQuality(q); setShowSettings(false); }}>{q}</button>
                      ))}
                    </div>
                  </div>
                  <div className="sp-row">
                    <span>Speed</span>
                    <div className="sp-options">
                      {[0.5,0.75,1,1.25,1.5,2].map(s => (
                        <button key={s} className={`sp-opt ${playbackSpeed === s ? 'active' : ''}`} onClick={() => { setPlaybackSpeed(s); setShowSettings(false); }}>{s}x</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Below player info */}
            <div className="player-info">
              <div>
                <h2 className="player-anime-title">{anime.title}</h2>
                <p className="player-ep-sub">Episode {currentEp.number}: {currentEp.title}</p>
              </div>
              <div className="player-info-actions">
                <button className="btn btn-ghost" onClick={handleDownload}><Download size={16}/> Download</button>
                <button className="btn btn-ghost" onClick={() => navigate(`/anime/${animeId}`)}><List size={16}/> All Episodes</button>
              </div>
            </div>
          </div>

          {/* Episode list sidebar */}
          <div className={`ep-sidebar ${showEpList ? 'open' : ''}`}>
            <div className="ep-sidebar-header">
              <h3>Episodes</h3>
              <button className="btn-icon" onClick={() => setShowEpList(false)}><ChevronLeft size={16}/></button>
            </div>
            <div className="ep-sidebar-list">
              {episodes.slice(0, 48).map(ep => (
                <div
                  key={ep.id}
                  className={`ep-sidebar-item ${ep.id === currentEp.id ? 'active' : ''}`}
                  onClick={() => { navigate(`/watch/${animeId}/${ep.id}`); setProgress(0); setIsPlaying(false); }}
                >
                  <span className="ep-sb-num">EP {ep.number}</span>
                  <span className="ep-sb-title">{ep.title}</span>
                  <span className="ep-sb-dur">{ep.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
