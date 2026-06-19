import React, { useState } from 'react';
import { MATCHES } from '../data/gameData';

export default function AdminPanel({ results, onSave, onClose }) {
  const [local, setLocal] = useState(() => {
    const copy = {};
    Object.entries(results).forEach(([k, v]) => { copy[k] = { ...v }; });
    return copy;
  });
  const [filter, setFilter] = useState('upcoming');
  const [search, setSearch] = useState('');

  const handleSet = (matchId, field, val) => {
    setLocal(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {}), [field]: val === '' ? undefined : Number(val) },
    }));
  };

  const handleClear = (matchId) => {
    setLocal(prev => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
  };

  const handleSave = () => {
    const clean = {};
    Object.entries(local).forEach(([k, v]) => {
      if (v.homeGoals !== undefined && v.awayGoals !== undefined) clean[k] = v;
    });
    onSave(clean);
    onClose();
  };

  const filtered = MATCHES.filter(m => {
    const played = local[m.id]?.homeGoals !== undefined;
    if (filter === 'played' && !played) return false;
    if (filter === 'upcoming' && played) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.home.toLowerCase().includes(q) || m.away.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Opdater resultater</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-live-note">
          🔴 Live-kampe og afsluttede resultater synkroniseres automatisk fra ESPN. Brug kun dette panel hvis et resultat er forkert, eller for kampe der ikke opdateres automatisk.
        </div>

        <div className="modal-controls">
          <input
            className="search-input"
            placeholder="Søg hold..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-bar">
            {[['all', 'Alle'], ['upcoming', 'Ikke spillet'], ['played', 'Spillet']].map(([v, l]) => (
              <button key={v} className={`filter-btn ${filter === v ? 'filter-btn--active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="modal-body">
          {filtered.map(m => {
            const r = local[m.id] || {};
            const played = r.homeGoals !== undefined && r.awayGoals !== undefined;
            return (
              <div key={m.id} className={`admin-row ${played ? 'admin-row--played' : ''}`}>
                <div className="admin-teams">
                  <span className="admin-team">{m.home}</span>
                  <span className="admin-vs">vs</span>
                  <span className="admin-team">{m.away}</span>
                </div>
                <div className="admin-inputs">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    className="score-input"
                    placeholder="–"
                    value={r.homeGoals ?? ''}
                    onChange={e => handleSet(m.id, 'homeGoals', e.target.value)}
                  />
                  <span className="score-sep">–</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    className="score-input"
                    placeholder="–"
                    value={r.awayGoals ?? ''}
                    onChange={e => handleSet(m.id, 'awayGoals', e.target.value)}
                  />
                  {played && (
                    <button className="clear-btn" onClick={() => handleClear(m.id)} title="Slet resultat">✕</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuller</button>
          <button className="btn-primary" onClick={handleSave}>Gem resultater</button>
        </div>
      </div>
    </div>
  );
}
