import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, RotateCcw, History } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AnimeCard from '../components/anime/AnimeCard';
import { MOCK_ANIME, GENRES } from '../data/animeData';
import { useAnime } from '../context/AnimeContext';
import './SearchPage.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'year', label: 'Newest' },
  { value: 'title', label: 'A–Z' },
  { value: 'episodes', label: 'Most Episodes' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recentSearches, saveRecentSearch, clearRecentSearches } = useAnime();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setInputVal(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = inputVal.trim();
    setQuery(next);
    if (next) {
      setSearchParams({ q: next });
      saveRecentSearch(next);
    } else setSearchParams({});
  };

  const toggleGenre = (g) => {
    setSelectedGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const results = useMemo(() => {
    let list = [...MOCK_ANIME];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.titleJP.toLowerCase().includes(q) ||
        a.studio.toLowerCase().includes(q) ||
        a.genre.some((g) => g.toLowerCase().includes(q)) ||
        a.description.toLowerCase().includes(q)
      );
    }
    if (selectedGenres.length) list = list.filter((a) => selectedGenres.every((g) => a.genre.includes(g)));
    if (selectedStatus) list = list.filter((a) => a.status === selectedStatus);
    if (selectedType) list = list.filter((a) => a.type === selectedType);
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'episodes') return b.episodes - a.episodes;
      return 0;
    });
    return list;
  }, [query, selectedGenres, selectedStatus, selectedType, sortBy]);

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedStatus('');
    setSelectedType('');
    setSortBy('rating');
  };
  const hasFilters = selectedGenres.length || selectedStatus || selectedType || sortBy !== 'rating';

  return (
    <Layout title="Discover">
      <div className="search-page page-enter">
        <div className="search-hero">
          <h1 className="search-hero-title">Discover Anime</h1>
          <form className="search-bar-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <Search size={20} className="si-icon" />
              <input className="input search-main-input" type="text" placeholder="Search by title, genre, studio..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
              {inputVal && (
                <button type="button" className="si-clear" onClick={() => { setInputVal(''); setQuery(''); setSearchParams({}); }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className={`btn btn-ghost filter-toggle-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters {hasFilters && <span className="filter-count">{selectedGenres.length + (selectedStatus ? 1 : 0) + (selectedType ? 1 : 0)}</span>}
            </button>
          </form>

          {recentSearches.length > 0 && (
            <div className="recent-searches-row">
              <div className="recent-searches-label"><History size={14} /> Recent</div>
              <div className="recent-search-chips">
                {recentSearches.map((item) => (
                  <button key={item} className="genre-chip" onClick={() => { setInputVal(item); setQuery(item); setSearchParams({ q: item }); }}>
                    {item}
                  </button>
                ))}
              </div>
              <button className="btn-icon" onClick={clearRecentSearches}><RotateCcw size={14} /></button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel glass">
            <div className="filter-row">
              <div className="filter-col">
                <label className="filter-label">Genres</label>
                <div className="genre-chips">
                  {GENRES.map((g) => (
                    <button key={g} className={`genre-chip ${selectedGenres.includes(g) ? 'active' : ''}`} onClick={() => toggleGenre(g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-col filter-col-sm">
                <div>
                  <label className="filter-label">Status</label>
                  <div className="status-chips">
                    {['Ongoing', 'Completed'].map((s) => (
                      <button key={s} className={`genre-chip ${selectedStatus === s ? 'active' : ''}`} onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="filter-label">Type</label>
                  <div className="status-chips">
                    {['TV'].map((t) => (
                      <button key={t} className={`genre-chip ${selectedType === t ? 'active' : ''}`} onClick={() => setSelectedType(selectedType === t ? '' : t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="filter-label">Sort By</label>
                  <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <button className="btn btn-ghost clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
              </div>
            </div>
          </div>
        )}

        <div className="search-results-header">
          <p className="results-count">{results.length} result{results.length !== 1 ? 's' : ''}{query ? ` for “${query}”` : ''}</p>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No anime matched your search</h3>
            <p>Try a different keyword, genre, or clear a few filters.</p>
          </div>
        ) : (
          <div className="anime-grid">{results.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}</div>
        )}
      </div>
    </Layout>
  );
}
