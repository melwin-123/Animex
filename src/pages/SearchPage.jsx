import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AnimeCard from '../components/anime/AnimeCard';
import { MOCK_ANIME, GENRES } from '../data/animeData';
import './SearchPage.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'year', label: 'Newest' },
  { value: 'title', label: 'A–Z' },
  { value: 'episodes', label: 'Most Episodes' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
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
    setQuery(inputVal);
    if (inputVal) setSearchParams({ q: inputVal });
    else setSearchParams({});
  };

  const toggleGenre = (g) => {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const results = useMemo(() => {
    let list = [...MOCK_ANIME];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.titleJP.includes(q) ||
        a.studio.toLowerCase().includes(q) ||
        a.genre.some(g => g.toLowerCase().includes(q))
      );
    }
    if (selectedGenres.length) list = list.filter(a => selectedGenres.every(g => a.genre.includes(g)));
    if (selectedStatus) list = list.filter(a => a.status === selectedStatus);
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'episodes') return b.episodes - a.episodes;
      return 0;
    });
    return list;
  }, [query, selectedGenres, selectedStatus, sortBy]);

  const clearFilters = () => { setSelectedGenres([]); setSelectedStatus(''); setSortBy('rating'); };
  const hasFilters = selectedGenres.length || selectedStatus || sortBy !== 'rating';

  return (
    <Layout title="Discover">
      <div className="search-page page-enter">
        {/* Search bar */}
        <div className="search-hero">
          <h1 className="search-hero-title">Discover Anime</h1>
          <form className="search-bar-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <Search size={20} className="si-icon" />
              <input
                className="input search-main-input"
                type="text"
                placeholder="Search by title, genre, studio..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
              />
              {inputVal && (
                <button type="button" className="si-clear" onClick={() => { setInputVal(''); setQuery(''); setSearchParams({}); }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className={`btn btn-ghost filter-toggle-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters {hasFilters && <span className="filter-count">{(selectedGenres.length + (selectedStatus ? 1 : 0))}</span>}
            </button>
          </form>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="filters-panel glass">
            <div className="filter-row">
              <div className="filter-col">
                <label className="filter-label">Genres</label>
                <div className="genre-chips">
                  {GENRES.map(g => (
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
                    {['Ongoing', 'Completed'].map(s => (
                      <button key={s} className={`genre-chip ${selectedStatus === s ? 'active' : ''}`} onClick={() => setSelectedStatus(selectedStatus === s ? '' : s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="filter-label">Sort By</label>
                  <div className="sort-chips">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} className={`genre-chip ${sortBy === o.value ? 'active' : ''}`} onClick={() => setSortBy(o.value)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
                {hasFilters && (
                  <button className="btn btn-ghost clear-filters-btn" onClick={clearFilters}>
                    <X size={14} /> Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active filter tags */}
        {(selectedGenres.length > 0 || selectedStatus) && (
          <div className="active-filters">
            {selectedGenres.map(g => (
              <button key={g} className="active-filter-tag" onClick={() => toggleGenre(g)}>
                {g} <X size={12} />
              </button>
            ))}
            {selectedStatus && (
              <button className="active-filter-tag" onClick={() => setSelectedStatus('')}>
                {selectedStatus} <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="results-header">
          <span className="results-count">
            {query ? <><strong>{results.length}</strong> results for "<em>{query}</em>"</> : <><strong>{results.length}</strong> anime found</>}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="anime-grid">{results.map(a => <AnimeCard key={a.id} anime={a} />)}</div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">( ˘︹˘ )</div>
            <p>No anime found</p>
            <span>Try different keywords or clear some filters</span>
          </div>
        )}
      </div>
    </Layout>
  );
}
